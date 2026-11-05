const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
test('UI renders safe previews, navigates folders and imports without overwriting',async()=>{
 const dom=new JSDOM(fs.readFileSync('public/index.html','utf8'),{runScripts:'outside-only',url:'http://localhost'});const w=dom.window;
 const entries=[{path:'My Folder',folder:true},{path:'My Folder/Note.md',folder:false},{path:'My Folder/Other Note.md',folder:false}];const uploaded=[];
 w.fetch=async(url,options)=>{const data=options?.body?JSON.parse(options.body):{};if(url==='/api/upload'){uploaded.push(data);entries.push({path:data.path,folder:false});}return {ok:true,json:async()=>url==='/api/session'?{authenticated:true}:url==='/api/tree'?entries:url.startsWith('/api/note?')?{content:'# Hello\n\n[[Other Note]]\n\n<script>alert(1)</script>',version:'v1'}:{ok:true}};};
 w.setInterval=()=>0;
 w.eval(fs.readFileSync('node_modules/marked/lib/marked.umd.js','utf8'));
 w.eval(fs.readFileSync('node_modules/dompurify/dist/purify.js','utf8'));
 w.eval(fs.readFileSync('public/app.js','utf8'));
 try{
 await new Promise(r=>setTimeout(r,50));
 await w.openNote('My Folder/Note.md');
 assert.equal(w.document.querySelector('#preview h1').textContent,'Hello');
 assert.equal(w.document.querySelector('#preview script'),null);
 assert.equal(w.document.querySelector('#preview a').classList.contains('broken'),false);
 assert.equal(w.resolveLink('Other%20Note.md'),'My Folder/Other Note.md');
 const folder=[...w.document.querySelectorAll('#tree button')].find(b=>b.title==='My Folder');await folder.onclick();
 assert.ok(![...w.document.querySelectorAll('#tree button')].some(b=>b.title==='My Folder/Note.md'));
 await w.importEntries([{path:'fresh.md',size:4,data:async()=>'dGVzdA=='},{path:'Note.md',size:4,data:async()=>'bmV3'}],'My Folder');
 assert.deepEqual(uploaded.map(x=>x.path),['My Folder/fresh.md']);
 assert.match(w.document.getElementById('status').textContent,/1 imported · 1 existing skipped/);
 assert.equal(w.document.querySelector('#note-count').textContent,'3');
 }finally{w.close();}
});
