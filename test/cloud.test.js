const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {PGlite}=require('@electric-sql/pglite');
const bcrypt=require('bcryptjs');
test('PostgreSQL persistence, authentication, folders, conflicts, uploads and instance restart',async()=>{
 process.env.SESSION_SECRET='test-secret-with-more-than-thirty-two-characters';
 process.env.APP_PASSWORD_HASH=bcrypt.hashSync('correct-password-123',4);
 const db=new PGlite();await db.exec(fs.readFileSync('db/schema.sql','utf8'));
 const pool={query:(...args)=>db.query(...args),connect:async()=>({query:(...args)=>db.query(...args),release(){}})};
 const {createCloudApp}=require('../cloud');let server=createCloudApp(pool).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 let base='http://127.0.0.1:'+server.address().port,cookie='';
 const request=(route,data)=>fetch(base+'/api/'+route,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json',cookie},body:data===undefined?undefined:JSON.stringify(data)});
 try{
 assert.equal((await request('tree')).status,401);
 const login=await request('login',{password:'correct-password-123'});assert.equal(login.status,200);
 cookie=login.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
 assert.equal((await request('session')).status,200);
 assert.equal((await request('folder',{path:'Work/研究'})).status,200);
 const created=await request('note',{path:'Work/研究/My note.md',content:'---\ntitle: Keep me\n---\n# Test',version:null});assert.equal(created.status,200);const {version}=await created.json();
 assert.equal((await request('note',{path:'Work/研究/My note.md',content:'Changed',version})).status,200);
 assert.equal((await request('note',{path:'Work/研究/My note.md',content:'Stale',version})).status,409);
 assert.equal((await request('move',{from:'Work',to:'Work/Child'})).status,400);
 assert.equal((await request('move',{from:'Work',to:'Archive/Work'})).status,200);
 assert.equal((await (await request('note?path='+encodeURIComponent('Archive/Work/研究/My note.md'))).json()).content,'Changed');
 assert.equal((await request('upload',{path:'Attachments/a.bin',data:Buffer.from([0,1,255]).toString('base64')})).status,200);
 assert.equal((await request('upload',{path:'Attachments/a.bin',data:'YQ=='})).status,409);
 assert.deepEqual(Buffer.from(await (await request('file?path=Attachments/a.bin')).arrayBuffer()),Buffer.from([0,1,255]));
 assert.equal((await request('folder',{path:'../../outside'})).status,400);
 assert.equal((await request('folder',{path:'Attachments/a.bin/child'})).status,400);
 assert.equal((await request('search?q=Changed')).status,200);
 await new Promise(r=>server.close(r));server=createCloudApp(pool).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base='http://127.0.0.1:'+server.address().port;
 assert.equal((await (await request('session')).json()).authenticated,true);
 assert.ok((await (await request('tree')).json()).some(x=>x.path==='Archive/Work/研究/My note.md'));
 assert.equal((await request('delete',{path:'Archive'})).status,200);
 assert.ok(!(await (await request('tree')).json()).some(x=>x.path.startsWith('Archive')));
 assert.equal((await request('logout',{})).status,200);
 }finally{await new Promise(r=>server.close(r));await db.close();}
});
