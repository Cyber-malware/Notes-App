const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Zip = require('adm-zip');
const app = express();
const root = path.resolve(process.env.VAULT_PATH || 'vault');
const state = path.resolve(process.env.STATE_PATH || '.state');
fs.mkdirSync(root, {recursive:true}); fs.mkdirSync(state,{recursive:true});
function safe(p='') {
  if(typeof p !== 'string' || p.includes('\\') || p.includes(':') || p.split('/').includes('..')) throw Error('Invalid path');
  const target = path.resolve(root,p);
  if(target !== root && !target.startsWith(root+path.sep)) throw Error('Invalid path');
  let current=root;
  for(const part of path.relative(root,target).split(path.sep).filter(Boolean)) {
    if(part.startsWith('.notes-tmp-')) throw Error('Reserved filename');
    current=path.join(current,part);
    if(fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw Error('Symlinks are not supported');
  }
  return target;
}
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function walk(dir='', result=[]) { for(const entry of fs.readdirSync(safe(dir),{withFileTypes:true})) {
  if(entry.isSymbolicLink() || entry.name.startsWith('.notes-tmp-')) continue;
  const p=dir?dir+'/'+entry.name:entry.name;
  result.push({path:p,folder:entry.isDirectory()}); if(entry.isDirectory()) walk(p,result);
} return result; }
app.disable('x-powered-by');
if(process.env.HTTPS==='true') app.set('trust proxy',1);
app.use((req,res,next)=>{res.set('X-Content-Type-Options','nosniff');res.set('X-Frame-Options','DENY');next();});
app.use(express.json({limit:'32mb'}));
app.use(session({secret:crypto.randomBytes(32).toString('hex'),resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'strict',secure:process.env.HTTPS==='true',maxAge:86400000}}));
app.use('/api',(req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(!['GET','HEAD'].includes(req.method) && req.get('origin') && new URL(req.get('origin')).host!==req.get('host')) return res.status(403).json({error:'Invalid origin'});
  next();
});
const credential=path.join(state,'password.json');
app.get('/api/session',(req,res)=>res.json({authenticated:!!req.session.auth,setup:!fs.existsSync(credential)}));
const attempts=new Map();
app.post('/api/login',async(req,res,next)=>{try {
  const now=Date.now(), old=attempts.get(req.ip)||{count:0,time:now};
  if(now-old.time>600000) {old.count=0;old.time=now;} old.count++;attempts.set(req.ip,old);
  if(old.count>20) return res.status(429).json({error:'Too many attempts. Try again in ten minutes.'});
  const password=req.body.password;
  if(typeof password!=='string'||password.length<12||password.length>72) throw Error('Use a password of 12–72 characters');
  if(!fs.existsSync(credential)) fs.writeFileSync(credential,JSON.stringify({hash:bcrypt.hashSync(password,12)}),{flag:'wx',mode:0o600});
  if(!await bcrypt.compare(password,JSON.parse(fs.readFileSync(credential)).hash)) return res.status(401).json({error:'Incorrect password'});
  req.session.regenerate(err=>{if(err)return next(err);req.session.auth=true;res.json({ok:true});});
}catch(e){next(e);}});
app.use('/api',(req,res,next)=>req.session.auth?next():res.status(401).json({error:'Please sign in'}));
app.post('/api/logout',(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get('/api/tree',(req,res)=>res.json(walk()));
app.get('/api/note',(req,res)=>{const data=fs.readFileSync(safe(req.query.path));res.json({content:data.toString('utf8'),version:hash(data)});});
app.post('/api/note',(req,res)=>{
  const {path:p,content,version}=req.body, target=safe(p);
  if(!p || !p.toLowerCase().endsWith('.md') || typeof content!=='string') throw Error('A Markdown filename and content are required');
  if(fs.existsSync(target)?hash(fs.readFileSync(target))!==version:version!=null) return res.status(409).json({error:'This note changed on disk. Download your draft or reload before saving.'});
  fs.mkdirSync(path.dirname(target),{recursive:true});
  const temp=path.join(path.dirname(target),'.notes-tmp-'+crypto.randomUUID());
  try { fs.writeFileSync(temp,content);fs.renameSync(temp,target); }finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
  res.json({version:hash(content)});
});
app.post('/api/folder',(req,res)=>{const p=safe(req.body.path);if(p===root)throw Error('Enter a folder name');if(fs.existsSync(p))throw Error('Folder already exists');fs.mkdirSync(p,{recursive:true});res.json({ok:true});});
app.post('/api/move',(req,res)=>{const from=safe(req.body.from),to=safe(req.body.to);if(from===root||to===root||fs.existsSync(to))throw Error('Invalid destination or destination exists');if(to.startsWith(from+path.sep))throw Error('Cannot move a folder inside itself');fs.mkdirSync(path.dirname(to),{recursive:true});fs.renameSync(from,to);res.json({ok:true});});
app.post('/api/delete',(req,res)=>{const p=safe(req.body.path);if(p===root)throw Error('Cannot delete vault root');fs.rmSync(p,{recursive:true});res.json({ok:true});});
app.get('/api/search',(req,res)=>{const q=String(req.query.q||'').toLowerCase();res.json(walk().filter(x=>!x.folder&&/\.md$/i.test(x.path)).flatMap(x=>fs.readFileSync(safe(x.path),'utf8').split('\n').flatMap((line,i)=>line.toLowerCase().includes(q)?[{path:x.path,line:i+1,snippet:line.slice(0,180)}]:[])).slice(0,200));});
app.post('/api/upload',(req,res)=>{const p=safe(req.body.path);if(p===root)throw Error('Filename required');fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.from(req.body.data,'base64'),{flag:'wx'});res.json({ok:true});});
app.post('/api/import',(req,res)=>{
  const zip=new Zip(Buffer.from(req.body.data,'base64'));const entries=zip.getEntries();let total=0;const seen=new Set();
  const prepared=entries.map(e=>{const p=safe(e.entryName);total+=e.header.size;if(total>100*1024*1024||entries.length>10000)throw Error('Archive exceeds import limit');if(p===root||seen.has(p)||fs.existsSync(p)&&!e.isDirectory)throw Error('Duplicate or existing file: '+e.entryName);seen.add(p);if(((e.attr>>>16)&0xf000)===0xa000)throw Error('Symlinks not allowed');return {e,p};});
  for(const {e,p} of prepared){if(e.isDirectory)fs.mkdirSync(p,{recursive:true});else{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,e.getData(),{flag:'wx'});}}res.json({ok:true});
});
app.get('/api/export',(req,res)=>{const zip=new Zip();for(const e of walk()){if(e.folder)zip.addFile(e.path+'/',Buffer.alloc(0));else zip.addFile(e.path,fs.readFileSync(safe(e.path)));}res.attachment('vault.zip').send(zip.toBuffer());});
app.get('/api/file',(req,res)=>{const p=safe(req.query.path);if(req.query.inline==='1'&&/\.(png|jpe?g|gif|webp)$/i.test(p))res.sendFile(p);else res.download(p);});
app.use('/vendor/marked',express.static(path.join(__dirname,'node_modules/marked/lib')));
app.use('/vendor/purify',express.static(path.join(__dirname,'node_modules/dompurify/dist')));
app.use(express.static(path.join(__dirname,'public')));
app.use((err,req,res,next)=>res.status(400).json({error:err.code==='ENOENT'?'File not found':err.message}));
if(require.main===module) app.listen(process.env.PORT||3000,process.env.HOST||'127.0.0.1',()=>console.log('Notes ready at http://localhost:'+(process.env.PORT||3000)));
module.exports={app,safe};
