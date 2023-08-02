require('dotenv').config()
var exec = require('child_process').exec;
const schedule = require('node-schedule')

const checkserver = async(req)=>{
  //console.log("check server",req.nodeip);
 return await new Promise((myReslove,myReject)=>{
    var v_host = 'XX.XX.XX.XXX'
    let kk = exec('mysqldump --host ' + process.env.aws_host + ' --user ' + process.env.aws_user + ' --password='+process.env.aws_password + ' --port ' + process.env.AWS_PORT + ' --single-transaction --routines --set-gtid-purged=OFF --triggers ' + process.env.aws_database +' > /ourly/dbbackup/ourly.sql',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    
    

  })
}

//checkserver()

schedule.scheduleJob('00 30 22 * * *', async function () {
  console.log("1111111111111");
  checkserver()
})

schedule.scheduleJob('00 30 13 * * *', async function () {
  console.log("22222222");
  checkserver()
})