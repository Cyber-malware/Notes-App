const readline=require('node:readline');
const bcrypt=require('bcryptjs');
const crypto=require('node:crypto');
// Mask terminal input; do not pass the password in command-line arguments.
const {Writable}=require('node:stream');let muted=false;
const output=new Writable({write(chunk,encoding,callback){if(!muted)process.stdout.write(chunk,encoding);callback();}});
const rl=readline.createInterface({input:process.stdin,output,terminal:true});
rl.question('New workspace password (10–72 UTF-8 bytes): ',password=>{muted=false;rl.close();if(password.length<10||Buffer.byteLength(password)>72){console.error('\nPassword must be at least 10 characters and at most 72 UTF-8 bytes.');process.exitCode=1;return;}console.log('\nAPP_PASSWORD_HASH='+bcrypt.hashSync(password,12));console.log('SESSION_SECRET='+crypto.randomBytes(32).toString('hex'));});muted=true;
