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


function addMarketCategory(name, cb) {
    try {
        const storeLocation = path.join(__dirname, "../", "MarketCategory", name+".json")

        fs.writeFile(storeLocation, JSON.stringify({
            FoodCategory:name
        }), (error)=>{
            if(!error) {
                cb(true)
            }
            else {
                LogError("Error", new Date(), error, "Add Market Category", name)
                cb(false)
            }
        })
    }
    catch (er) {
        LogError("Error", new Date(), er, "Add Market Category", name)
        cb(false)
    }
}

function allMarketCategory() {
    return new Promise((resolve, reject)=>{
        const storeLocation = path.join(__dirname, "../", "MarketCategory")

        fs.readdir(storeLocation, (er, data)=> {
            if(!er) {
                let categories = Array.from(data)
                resolve(categories)
            }
            else {
                LogError("Error", new Date(), er, "All Market Category", "");
                reject(er)
            }
        })
    });
}

function readMarketData(name) {

    return new Promise((resolve, reject)=>{
        var userObjectName = path.join(__dirname, "../", "marketsStore", name)
        fs.readFile(userObjectName, (er, data)=>{
            if(!er) {
                const datum = JSON.parse(data)
                //console.log(datum)
                resolve(datum)
            }
            else {
                LogError("An Error has occured", new Date(), er, "readuserData", name)
                reject(er)
            }
        })



    })

}

function readCategoryData(name) {
    return new Promise((resolve, reject)=>{
        var userObjectName = path.join(__dirname, "../", "MarketCategory", name)
        fs.readFile(userObjectName, (er, data)=>{
            if(!er) {
                const datum = JSON.parse(data)
                //console.log(datum)
                resolve(datum)
            }
            else {
                LogError("An Error has occured", new Date(), er, "readuserData", name)
                reject(er)
            }
        })



    })
}
function storeMarketInfo(marketInfo={name:"", images:[],description:"", location:"", Category:"", Price:0.00}, callback) {
    try {
        var marketsName = marketInfo.name+"_"+Date.now().toString()+".json"
        var marketInfoName = path.join(__dirname, "../", "marketsStore", marketsName)
       fs.writeFile(marketInfoName, JSON.stringify(marketInfo), (er)=>{
           if(!er) {
                //const datum = JSON.parse(data)
                //console.log(datum)
                callback(true)
           }
           else {
                LogError("An Error has occured", new Date(), er, "storeMarketInfo", {name:marketsName, description:description, originalName:name})
                callback(false)
           }
       })
    }
    catch(er) {
        LogError("An Error has occured", new Date(), er, "storeMarketInfo", {name:marketsName, description:description, originalName:name})
        callback(false)
    }
    
}

function getAllMarketData(callback=null) {

    return new Promise((resolve, reject)=>{
        let dir = path.join(__dirname, "../", "marketsStore");
        var finalResuls = [];
        fs.readdir(dir, (er, data)=>{
            if(!er) {
                let markets = Array.from(data)
                let second = markets;
                //console.log(markets)
                //var finalResuls = []

/*

                for(var i=0;i<markets.length;i++) {
                    let currentFilePath = path.join(__dirname,"../", "marketsStore", markets[i])
                    fs.readFile(currentFilePath, (er, datum)=>{
                        // console.log(datum)
                        if(!er) {
                            let currentData = JSON.parse(datum)
                            let indexOf = second.indexOf(markets[i]);
                            second.splice(indexOf, 1)
                            second.push(currentData)
                            //console.log(currentData)
                            finalResuls.push(currentData)
                            //console.log(finalResuls)
                        }
                        else {
                            LogError('An Error has occured', new Date(), er, "reading file", v)
                            reject(er)
                        }
                    })
                }
                */

              //console.log(finalResuls)
                /*
                markets.forEach(v => {
                    let currentFilePath = path.join(__dirname,"../", "marketsStore", v)
                    fs.readFile(currentFilePath, (er, datum)=>{
                        // console.log(datum)
                        if(!er) {
                            let currentData = JSON.parse(datum)
                            //console.log(currentData)
                            finalResuls.push(currentData)
                            //console.log(finalResuls)
                        }
                        else {
                            LogError('An Error has occured', new Date(), er, "reading file", v)
                            reject(er)
                        }
                    })
                })
                */
                resolve(markets)

            }
            else {
                LogError("An Error has occured", new Date(), er, "getAllMarketData", "all market")
                //callback(null)
                reject(er)
            }
        })
    })



}

function deleteData(filepath,callback ) {
    try {

        var basename = path.basename(filepath)
        var extName = path.extname(filepath)
        var filename = basename+"."+extName

        var realFilePath = path.join(__dirname, "../", "marketsStore", filepath)

        fs.unlink(realFilePath, (er)=> {
            if(!er) {
                callback(true)
            }
            else {
                callback(false)
            }
        })
    }
    catch(er) {
        LogError("An Error has occured", new Date(), er, "readuserData", {name:marketsName, description:description, originalName:name})
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
    readCategoryData:readCategoryData,
    addMarketCategory:addMarketCategory,
    allMarketCategory:allMarketCategory,
    storeUserData:storeUserData,
    LogError:LogError,
    readUserData:readUserData,
    storeMarketInfo:storeMarketInfo,
    deleteData:deleteData,
    readMarketData, readMarketData,
    getAllMarketData:getAllMarketData
}