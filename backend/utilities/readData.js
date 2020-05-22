var fs = require("fs")
var path = require("path")

/*
function storeUserData(userInfo={username:"", password:"", email:""}){
    var userObjectName = path.join(__dirname, "../", "data", userInfo.username+".json")
    fs.open(userObjectName, "wx", (er, fd)=>{
        if(!er && fd) {
            data =  JSON.stringify(userInfo)

            fs.writeFile(fd, data, (er)=>{
                if(!er) {
                    fs.close(fd, (er)=>{
                        console.log("user data logged")
                        return true;
                    })
                }
            })
        }
        else {
            LogError(er, new Date(), er, "storeUseData", userInfo.username)
            return false;
        }
    })
}

*/

function storeUserData(userInfo={username:"", password:"", email:""}, callback){
    var userObjectName = path.join(__dirname, "../", "data", userInfo.username+".json")

    fs.exists(userObjectName, (data)=> {
        if(data == true) {
            LogError(`${userObjectName} exist before`, new Date(), `${userObjectName} exist before`, "storeUseData", userInfo.username)
            console.log(`${userObjectName} exist before`)
            callback(false);
        }
        else {
            fs.writeFile(userObjectName, JSON.stringify(userInfo), (er)=> {
                if(!er) {
                    console.log(`${userInfo.username} created`)
                    callback(true)
                }
                
                    else {
                        LogError(er, new Date(), er, "storeUseData", userInfo.username)
                        callback(false);
                    }
                
        })
        }
    })
 
  
}

function readUserData(username="akintunde", callback) {
    try {
        var userObjectName = path.join(__dirname, "../", "data", username+".json")
       fs.readFile(userObjectName, (er, data)=>{
           if(!er) {
                const datum = JSON.parse(data)
                //console.log(datum)
                callback(datum)
           }
           else {
                LogError("An Error has occured", new Date(), er, "readuserData", username)
                callback(null)
           }
       })
    }
    catch(er) {
        LogError("An Error has occured", new Date(), er, "readuserData", username)
        callback(null)
    }
   
}


function LogError (message, timeOfOccurence, StackTrace, methodName, currentUser){
    var dti = new Date()
    var timeOfIt = dti.getFullYear()+""+dti.getMonth()+""+dti.getDay()+""+dti.getHours()+""+dti.getMinutes()+""+dti.getSeconds()
    var pathi = path.join(__dirname, "../", "errorLogs", `${methodName}_${currentUser}_${timeOfIt}_error.json`)
    var errors = {
        message:message,
        timeOfOccurence:timeOfOccurence,
        StackTrace:StackTrace,
        methodName:methodName,
        currentUser:currentUser
    }

    fs.open(pathi, "wx", (er, fd)=>{
        if(!er && fd) {
            fs.writeFile(fd, JSON.stringify(errors), (er)=>{
                if(!er) {
                    fs.close(fd, (er)=>{
                        console.log("File Logged...")
                    })
                }
            })
        }
    })
}

module.exports = {
    storeUserData:storeUserData,
    LogError:LogError,
    readUserData:readUserData
}