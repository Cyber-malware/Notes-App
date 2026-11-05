// PostgreSQL backend for serverless deployments. Local mode remains in server.js.
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const path = require('node:path');
const {Pool} = require('pg');
const MAX_FILE = 2 * 1024 * 1024;
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
function valid(p){
 if(typeof p!=='string'||!p||p.length>1000||p.startsWith('/')||/[\\:\x00-\x1f]/.test(p)||p.split('/').some(x=>!x||x==='.'||x==='..'))fail('Invalid file path');
 return p;
}
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function createCloudApp(pool = new Pool({connectionString:process.env.DATABASE_URL,max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:10000})) {
 const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
 app.use(express.json({limit:'3mb'}));
 app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'});next();});
 app.use('/api',(req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32||!process.env.APP_PASSWORD_HASH)return res.status(503).json({error:'Configure DATABASE_URL, SESSION_SECRET and APP_PASSWORD_HASH before using this deployment.'});
  if(req.method!=='GET'&&req.get('origin')&&new URL(req.get('origin')).host!==req.get('host'))return res.status(403).json({error:'Invalid origin'});
  next();
 });
 app.use(cookieSession({name:'fieldnotes',keys:[process.env.SESSION_SECRET||'unconfigured'],httpOnly:true,sameSite:'strict',secure:!!process.env.VERCEL||process.env.HTTPS==='true',maxAge:86400000}));
 const authRevision=()=>digest(process.env.APP_PASSWORD_HASH||'');
 const authenticated=req=>req.session?.auth===authRevision()&&req.session.expires>Date.now();
 app.get('/api/session',(req,res)=>res.json({authenticated:authenticated(req),setup:false,storage:'postgres',maxFileBytes:MAX_FILE}));
 app.post('/api/login',async(req,res)=>{
  // Shared rate limit survives function restarts and applies across instances.
  const key=digest(req.ip||'unknown');
  const {rows}=await pool.query(`INSERT INTO login_attempts (key,count,started) VALUES ($1,1,now()) ON CONFLICT (key) DO UPDATE SET count=CASE WHEN login_attempts.started < now()-interval '10 minutes' THEN 1 ELSE login_attempts.count+1 END, started=CASE WHEN login_attempts.started < now()-interval '10 minutes' THEN now() ELSE login_attempts.started END RETURNING count`,[key]);
  if(rows[0].count>20)fail('Too many attempts. Try again in ten minutes.',429);
  const password=req.body.password;
  if(typeof password!=='string'||Buffer.byteLength(password)>72||!await bcrypt.compare(password,process.env.APP_PASSWORD_HASH))fail('Incorrect password',401);
  req.session={auth:authRevision(),expires:Date.now()+86400000};res.json({ok:true});
 });
 app.use('/api',(req,res,next)=>authenticated(req)?next():res.status(401).json({error:'Please sign in'}));
 app.post('/api/logout',(req,res)=>{req.session=null;res.json({ok:true});});
 async function transaction(fn){const client=await pool.connect();try{await client.query('BEGIN');await client.query('SELECT pg_advisory_xact_lock(721903)');const result=await fn(client);await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}
 async function get(c,p){return (await c.query('SELECT * FROM vault_entries WHERE path=$1',[p])).rows[0];}
 async function parents(c,p){const parts=p.split('/');parts.pop();let prefix='';for(const part of parts){prefix+=(prefix?'/':'')+part;const row=await get(c,prefix);if(row&&!row.folder)fail('A file blocks the folder path: '+prefix);if(!row)await c.query('INSERT INTO vault_entries(path,folder) VALUES ($1,true)',[prefix]);}}
 app.get('/api/tree',async(req,res)=>res.json((await pool.query('SELECT path,folder,octet_length(data) AS size,updated FROM vault_entries ORDER BY path')).rows));
 app.get('/api/note',async(req,res)=>{const row=await get(pool,valid(req.query.path));if(!row||row.folder)fail('Note not found',404);res.json({content:Buffer.from(row.data).toString('utf8'),version:row.version});});
 app.post('/api/note',async(req,res)=>{const p=valid(req.body.path);if(!/\.md$/i.test(p)||typeof req.body.content!=='string')fail('Markdown filename and content required');const data=Buffer.from(req.body.content);if(data.length>MAX_FILE)fail('Notes must be under 2 MB',413);await transaction(async c=>{const old=await get(c,p);if(old?old.folder||old.version!==req.body.version:req.body.version!=null)fail('This note changed. Download your draft and reload before saving.',409);await parents(c,p);await c.query('INSERT INTO vault_entries(path,folder,data,version) VALUES ($1,false,$2,$3) ON CONFLICT(path) DO UPDATE SET data=$2,version=$3,updated=now()',[p,data,digest(data)]);});res.json({version:digest(data)});});
 app.post('/api/folder',async(req,res)=>{const p=valid(req.body.path);await transaction(async c=>{if(await get(c,p))fail('Folder already exists');await parents(c,p);await c.query('INSERT INTO vault_entries(path,folder) VALUES ($1,true)',[p]);});res.json({ok:true});});
 app.post('/api/move',async(req,res)=>{const from=valid(req.body.from),to=valid(req.body.to);if(to===from||to.startsWith(from+'/'))fail('Cannot move an item inside itself');await transaction(async c=>{if(!await get(c,from))fail('Source not found',404);if(await get(c,to))fail('Destination already exists');await parents(c,to);await c.query("UPDATE vault_entries SET path=$2 || substring(path from length($1)+1),updated=now() WHERE path=$1 OR left(path,length($1)+1)=$1 || '/'",[from,to]);});res.json({ok:true});});
 app.post('/api/delete',async(req,res)=>{const p=valid(req.body.path);await transaction(c=>c.query("DELETE FROM vault_entries WHERE path=$1 OR left(path,length($1)+1)=$1 || '/'",[p]));res.json({ok:true});});
 app.get('/api/search',async(req,res)=>{const q=String(req.query.q||'').toLowerCase();if(!q)return res.json([]);const {rows}=await pool.query("SELECT path,data FROM vault_entries WHERE NOT folder AND lower(right(path,3))='.md'");const results=[];for(const row of rows){const lines=Buffer.from(row.data).toString('utf8').split('\n');for(let i=0;i<lines.length&&results.length<200;i++)if(lines[i].toLowerCase().includes(q))results.push({path:row.path,line:i+1,snippet:lines[i].slice(0,180)});}res.json(results);});
 app.post('/api/upload',async(req,res)=>{const p=valid(req.body.path);if(typeof req.body.data!=='string')fail('Missing upload');const data=Buffer.from(req.body.data,'base64');if(data.length>MAX_FILE)fail('Files must be under 2 MB',413);await transaction(async c=>{if(await get(c,p))fail('File already exists: '+p,409);await parents(c,p);await c.query('INSERT INTO vault_entries(path,folder,data,version) VALUES($1,false,$2,$3)',[p,data,digest(data)]);});res.json({ok:true});});
 // Browser builds ZIP exports so a whole vault never crosses Vercel's response limit.
 app.get('/api/file',async(req,res)=>{const p=valid(req.query.path),row=await get(pool,p);if(!row||row.folder)fail('File not found',404);const ext=path.extname(p).toLowerCase();const types={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp'};res.type(req.query.inline==='1'&&types[ext]?types[ext]:'application/octet-stream');if(!(req.query.inline==='1'&&types[ext]))res.attachment(path.basename(p));res.send(Buffer.from(row.data));});
 app.use('/vendor/marked',express.static(path.join(__dirname,'node_modules/marked/lib')));
 app.use('/vendor/purify',express.static(path.join(__dirname,'node_modules/dompurify/dist')));
 app.use('/vendor/fflate',express.static(path.join(__dirname,'node_modules/fflate/umd')));
 app.use(express.static(path.join(__dirname,'public')));
 app.use((err,req,res,next)=>{console.error('Request failed:',err.code||err.status||'unknown');res.status(err.status||500).json({error:err.status?err.message:'Storage unavailable. Check database configuration and migrations.'});});
 return app;
}
module.exports={createCloudApp,valid};
