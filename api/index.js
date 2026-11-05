// Explicit Vercel entry point. Never fall back to ephemeral local storage.
const {createCloudApp}=require('../cloud');
module.exports=createCloudApp();
