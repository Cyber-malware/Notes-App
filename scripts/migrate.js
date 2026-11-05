const fs=require('node:fs');
const path=require('node:path');
const {Pool}=require('pg');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
pool.query(fs.readFileSync(path.join(__dirname,'../db/schema.sql'),'utf8')).then(()=>console.log('Database schema ready.')).catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>pool.end());
