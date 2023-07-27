require('dotenv').config()
var exec = require('child_process').exec;
const schedule = require('node-schedule')

const checkserver = async(req)=>{
  //console.log("check server",req.nodeip);
 return await new Promise((myReslove,myReject)=>{
    var v_host = 'XX.XX.XX.XXX'
    // let kk = exec('E:/codeBase/pronteff_clockify/Ourly_backend/Clockify_backend/server/utils/backup_db.sh',async(error,stderr,stdout)=>{
    //   console.log("ssssss",stdout);
    //   console.log("nnnnn",stderr);
    //   console.log("eeee",error);
    //   await setTimeout(() => console.log('Timeout'), 10000);
      
    //   myReslove(rerddata)
    //   if(rerddata.length>0){
    //    myReslove(rerddata)
    //   }
    //   if(stderr.length>0){
    //    myReslove(0)
    //   }
    //   else{C:/Users/SSC/Documents/dumps/ourly.sql

    //    myReslove(rerddata) /home/ourly/Desktop/databasebackup
    //   } 'mysqldump --host ourlyproddatabase.ctthlmqttiri.ap-south-1.rds.amazonaws.com --user ourly_master --password=Our1y!MYSQL* --port 1525 --single-transaction --routines --set-gtid-purged=OFF --triggers ourly > /home/ourly/Desktop/databasebackup/ourly.sql'   /ourly/dbbackup
      
    // })
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
//console.log('mysqldump --host ' + process.env.aws_host + ' --user ' + process.env.aws_user + ' --password='+process.env.aws_password + ' --port ' + process.env.AWS_PORT + ' --single-transaction --routines --set-gtid-purged=OFF --triggers ' + process.env.aws_database +' > C:/Users/SSC/Documents/dumps/ourly.sql');

//checkserver()

schedule.scheduleJob('00 30 22 * * *', async function () {
  console.log("1111111111111");
  checkserver()
})

schedule.scheduleJob('00 30 13 * * *', async function () {
  console.log("22222222");
  checkserver()
})