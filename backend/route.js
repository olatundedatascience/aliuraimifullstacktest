const app = require("express")
var {AdminController} = require("./controllers/AdminController")


const router = app.Router()


//router.get("/all")

router.post("/createAdmin", AdminController.CreateAdmin);


module.exports ={router}
