var response = require("../models/responseObject")
var {storeUserData, LogError, readUserData} = require("../utilities/readData")
var {validation} = require("../utilities/validators")

class AdminController {
    static CreateAdmin(req, res, next) {

        try {
            const email = req.body.email
            const password = req.body.password
            const username = req.body.username
            
            const emailError = validation.isRequired(email).IsString(email)
            const passwordError = validation.isRequired(password).isPassword(password)
            const usernameError = validation.isRequired(username).IsString(username)
    //console.log(emailError, passwordError, usernameError)
            if(emailError.errors.length > 0 && passwordError.errors.length > 0 && usernameError.errors.length == 0) {
                emailError.errors.forEach(v => response.message += v);
                passwordError.errors.forEach(v => response.message += v);
                usernameError.errors.forEach(v => response.message += v);
    
                response.description = "input validation failed"
                response.statusCode = "99"
    
                res.status(400).send(response)
            }
            else {
                 storeUserData({username:username, email:email, password:password}, (result)=>{
                    if(result) {
                        response.statusCode ="00"
                        response.message = "Success"
                        response.description =`${email} successfully created`
                        
                        res.status(200).send(response)
                    }
                    else {
                        response.statusCode ="99"
                        response.message = "Failed"
                        response.description =`failed to create ${email}`
                        
                        res.status(200).send(response)
                    }
                    
                })
                
                  
                
            }
        }
        catch(er) {
            LogError("an error has occured", new Date(), er, "Create Admin", req.body.email)
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"
            
            res.status(500).send(response)
        }

        //next()
      
    }

    static getAdmin(req, res, next) {
        try {
            let email = typeof(req.params.email) == "string" ? req.params.email : false;

            if(email) {
                    readUserData(email, (data)=>{
                        if(data != null || data) {
                            response.statusCode ="00"
                            response.message = `${email} retrieved`
                            response.description ="Success"
                            response.response = data
            
                            res.status(404).send(response)

                        }
                        else {
                            response.statusCode ="99"
                            response.message = `no data found for ${email}`
                            response.description ="Failed"
            
                            res.status(404).send(response)
                        }
                    })
            }
            else {
                response.statusCode ="99"
                response.message = `failed parameter validation for email/username`
                response.description ="Failed"
            
                res.status(400).send(response)
            }
        }
        catch(er) {
            LogError("an error has occured", new Date(), er, "get admin by email", req.body.email)
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"
            
            res.status(500).send(response)
        }
        

    }
}

module.exports = 
{
    AdminController
}