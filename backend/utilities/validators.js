var {LogError}= require("../utilities/readData")
var IError = require("../errorLogs/IError")
var {isRequired, isEmpty, isNumber, isString,meetPassword} = require("../utilities/rules")

const  validation = {
   errors:[],
   isRequired:function(input) {
       let result = isRequired(input)

       result == false ? this.errors.push(`${input} is required`):""

       return this;
   },

   isEmpty:function (input)
   {
       let result = isEmpty(input)
       result == true ? this.errors.push(`${input} cant be empty`):""
       return this;
   },
   IsString:function(input) {
       let result = isString(input)
       result == false ? this.errors.push(`${input} must be a string`):""
       return this;
   },
   isPassword:function(input) {
        let result = meetPassword(input)
        result == false ? this.errors.push(`${input} does not meet password requirement`):""
        return this;
   }


    

}

module.exports ={validation}