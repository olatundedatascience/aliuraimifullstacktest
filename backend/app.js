var express = require("express")
var app = express()
var body = require("body-parser")
var cors = require("cors")
var router = require("./route")
var {AdminController} = require("./controllers/AdminController")
var {AuthController} = require("./controllers/AuthController")


app.use(body({urlencoded:false}))
app.use(cors())

app.use("/CreateAdmin", AdminController.CreateAdmin)
app.get("/getAdmin/:email", AdminController.getAdmin)
app.post("/auth", AuthController.Authenticate)

app.get("/validate", AuthController.ValidateToken)


app.listen(3200, ()=>"serving port 200")