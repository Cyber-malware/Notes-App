const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fieldnotes-test-'));
process.env.VAULT_PATH=path.join(temp,'vault');process.env.STATE_PATH=path.join(temp,'state');
const {app,safe}=require('../server');
test('authenticated vault lifecycle and safety',async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const url='http://127.0.0.1:'+server.address().port;let cookie='';
 async function request(route,data){return fetch(url+'/api/'+route,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json',cookie},body:data===undefined?undefined:JSON.stringify(data)});}
 try{
 assert.equal((await request('tree')).status,401);
 let r=await request('login',{password:'test-password-long-enough'});assert.equal(r.status,200);cookie=r.headers.get('set-cookie').split(';')[0];
 assert.throws(()=>safe('../escape'));assert.throws(()=>safe('..\\escape'));assert.throws(()=>safe('C:/escape'));
 assert.equal((await request('folder',{path:'Research/Deep/Notes'})).status,200);
 assert.equal((await request('folder',{path:'Research/Deep/Notes'})).status,400);
 assert.equal((await request('note',{path:'Research/Deep/Notes/Idea.MD',content:'Nested content',version:null})).status,200);
 assert.equal((await request('move',{from:'Research',to:'Research/Child'})).status,400);
 assert.equal((await request('move',{from:'Research',to:'Archive/Research'})).status,200);
 assert.equal(fs.readFileSync(path.join(process.env.VAULT_PATH,'Archive/Research/Deep/Notes/Idea.MD'),'utf8'),'Nested content');
 assert.equal((await (await request('search?q=Nested')).json())[0].path,'Archive/Research/Deep/Notes/Idea.MD');
 assert.equal((await request('delete',{path:'Archive'})).status,200);
 assert.ok(!fs.existsSync(path.join(process.env.VAULT_PATH,'Archive')));
 for(const asset of ['/vendor/marked/marked.umd.js','/vendor/purify/purify.min.js','/app.js'])assert.equal((await fetch(url+asset)).status,200);
 r=await request('note',{path:'Projects/Hello.md',content:'# Hello\n',version:null});assert.equal(r.status,200);const first=await r.json();
 assert.equal(fs.readFileSync(path.join(process.env.VAULT_PATH,'Projects/Hello.md'),'utf8'),'# Hello\n');
 fs.writeFileSync(path.join(process.env.VAULT_PATH,'Projects/Hello.md'),'External change');
 assert.equal((await request('note',{path:'Projects/Hello.md',content:'overwrite',version:first.version})).status,409);
 assert.equal(fs.readFileSync(path.join(process.env.VAULT_PATH,'Projects/Hello.md'),'utf8'),'External change');
 assert.equal((await request('upload',{path:'../../escape',data:'YQ=='})).status,400);
 assert.equal((await request('upload',{path:'Attachments/test.txt',data:'aGVsbG8='})).status,200);
 assert.equal((await request('upload',{path:'Attachments/test.txt',data:'YQ=='})).status,400);
 assert.equal((await request('search?q=External')).status,200);
 r=await request('export');assert.equal(r.status,200);assert.equal(Buffer.from(await r.arrayBuffer()).subarray(0,2).toString(),'PK');
 assert.equal((await request('move',{from:'Projects/Hello.md',to:'Projects/Renamed.md'})).status,200);
 assert.equal((await request('delete',{path:'Projects/Renamed.md'})).status,200);
 assert.equal((await request('delete',{path:''})).status,400);
 }finally{await new Promise(r=>server.close(r));fs.rmSync(temp,{recursive:true,force:true});}
});
