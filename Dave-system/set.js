
const appname = process.env.APP_NAME || '';
const herokuapi = process.env.HEROKU_API;
const antidel = process.env.ANTIDELETE || 'TRUE';


module.exports = { antidel, herokuapi, appname};  
