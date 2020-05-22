const jwt = require("jsonwebtoken")
var response = require("../models/responseObject")
var {storeUserData, LogError, readUserData} = require("../utilities/readData")
var config = require("../settings/config.json")

class AuthController {
    static Authenticate(req, res, next) {

        try {
            const email = req.body.email
            const password = req.body.password

            if(email && password) {
                readUserData(email, (data)=> {
                    if(data || data != null) {
                        var responseme = data
                        var tokenExpireTime = new Date().setMinutes(new Date().getMinutes() + 10)
                        responseme["expireAt"] = tokenExpireTime
                        //npm var tokens = 
                        const tokens = jwt.sign(responseme, config.jwt.key)

                        
                        response.statusCode ="00"
                        response.message = `success`
                        response.description ="authentication successful"
                        response.response = tokens
                
                        res.status(400).send(response)
                        //readUserData()
                    }
                    else {
                        
                        response.statusCode ="99"
                        response.message = `no data found ${email}`
                        response.description ="Failed"
                
                        res.status(400).send(response)
                    }
                })
            }
            else {
                response.statusCode ="99"
                response.message = "Failed Paramter validation for email and password"
                response.description ="Failed"
                
                res.status(400).send(response)
            }

        }
        catch(er) {
            LogError("An error has occured", new Date(), er, "Authenticate", req.body.email)
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"
            
            res.status(500).send(response)
        }

    }

    static ValidateToken(req, res, next) {
        try {
            const token = typeof(req.headers["x-token"]) == "string" ? req.headers["x-token"]: false
            const username = typeof(req.headers["x-username"]) == "string" ? req.headers["x-username"]: false
            const password  = typeof(req.headers["x-password"]) == "string" ? req.headers["x-password"]: false

            if(token && username && password) {
                const tokenValidated = jwt.verify(token, config.jwt.key)
               // console.log(username, password)
                if(tokenValidated) {
                    var data = tokenValidated
                    //console.log()
                    console.log(tokenValidated.password.trim() == password)
                    if(tokenValidated.username.trim() == username && tokenValidated.password.trim() == password) {
                        readUserData(data.username, (datum)=>{
                            if(datum || datum != null) {
                               // console.log(datum)
                                var currentTime = Date.now().toString()
                                //console.log(currentTime)
                                var tokenExpiredTime = data.expireAt
                                if(currentTime < tokenExpiredTime) {

                                    response.statusCode ="00"
                                    response.message = "token validated"
                                    response.description ="Success"
                                    response.response = data
                            
                                    res.status(200).send(response)

                                }
                                else {
                                    response.statusCode ="99"
                                    response.message = "expired token..pls recreate"
                                    response.description ="Failed"
                            
                                    res.status(400).send(response)   
                                }
                            }
                            else {
                                response.statusCode ="99"
                                response.message = "invalid username or password combination"
                                response.description ="Failed"
                        
                                res.status(400).send(response)
                            }
                        })
                       
                    }
                    else {
                                response.statusCode ="99"
                                response.message = "the username and password supplied does not match credentials on the token"
                                response.description ="Failed"
                        
                                res.status(400).send(response)
                    }
                   
                }
                else {
                    response.statusCode ="99"
                    response.message = "error validating token"
                    response.description ="Failed"
                    
                    res.status(400).send(response)
                }
            }
            else {
                response.statusCode ="99"
                response.message = "token is required, which must be passed through header"
                response.description ="Failed"
                
                res.status(400).send(response)
            }
        }
        catch(er) {
            LogError("An error has occured", new Date(), er, "validate token", req.headers["x-token"])
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"
            
            res.status(500).send(response)
        }
    }
}

module.exports = {AuthController}