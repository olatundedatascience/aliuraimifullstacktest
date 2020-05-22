var app = require("express")()
var body = require("body-parser")
var cors = require("cors")
var router = require("./route")
var {AdminController} = require("./controllers/AdminController")


app.use(body())
app.use(cors())

app.use("/CreateAdmin", AdminController.CreateAdmin)


app.listen(3200, ()=>"serving port 200")