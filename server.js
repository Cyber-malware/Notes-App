const {app,safe}=process.env.DATABASE_URL||process.env.VERCEL
 ? {app:require('./cloud').createCloudApp()}
 : require('./local-server');
if(require.main===module)app.listen(process.env.PORT||3000,process.env.HOST||'127.0.0.1',()=>console.log('Fieldnotes ready at http://localhost:'+(process.env.PORT||3000)));
module.exports={app,safe};
