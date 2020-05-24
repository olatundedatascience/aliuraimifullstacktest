var express = require("express")
var app = express()
var body = require("body-parser")
var cors = require("cors")
var router = require("./route")
var {AdminController} = require("./controllers/AdminController")
var {AuthController} = require("./controllers/AuthController")
var {MarketController} = require("./controllers/MarketsController")


app.use(body({urlencoded:false}))
app.use(cors())

app.use("/CreateAdmin", AdminController.CreateAdmin)
app.get("/getAdmin/:email", AdminController.getAdmin)
app.post("/auth", AuthController.Authenticate)
app.get("/validate", AuthController.ValidateToken)

app.post("/CreateMarket", MarketController.createMarket)
app.get("/allMarket", MarketController.getAllMarket)
app.get("/delete/:name", MarketController.deleteMarket)

app.post("/createCategory", MarketController.createFoodCategory)
app.get("/allCategories", MarketController.allCategories)

app.listen(3200, ()=>"serving port 200")