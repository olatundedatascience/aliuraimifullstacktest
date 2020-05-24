var response = require("../models/responseObject")
var {storeUserData, LogError, readUserData, storeMarketInfo,
    getAllMarketData, readMarketData, addMarketCategory,
    allMarketCategory, deleteData, readCategoryData} = require("../utilities/readData")
var Category = require("../utilities/MarketsCategory")

class MarketController {
    static async getAllMarket(req, res, next) {

        try {

            const results = await getAllMarketData()
            var responseData = [];

            for(var i=0;i<results.length;i++) {
                var current = results[i];
                var details = await readMarketData(current);
                details["timestamp"] = current
                responseData.push(details)
            }
            response.statusCode ="00"
            response.message = "Market Data retrieved"
            response.description ="success"
            response.response = responseData

            res.status(200).send(response)


        }
        catch(er) {
            LogError("An error has occured", new Date(), er, "get All Market", "All Market")
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"

            res.status(500).send(response)
        }


    }

    static createMarket(req, res, next) {
        try {
            const name = typeof(req.body.name) == "string" ? req.body.name : false;
            const description = typeof(req.body.description) == "string" ? req.body.description : false;
            const price =  req.body.price
            const location = typeof(req.body.location) == "string" ? req.body.location : false;
            const images =  req.body.images
            const category =  typeof(req.body.category) == "string" ? req.body.category : false;
            //console.log(name, description, price, location, images)

            if(name) {
                storeMarketInfo({name:name, description:description, location:location, images:images, price:price,
                    category:category}, (result)=>{
                    if(result) {
                        response.statusCode ="00"
                        response.message = `${name} created`
                        response.description ="Sucess"
                        
                        res.status(200).send(response)     
                    }
                    else {
                            response.statusCode ="99"
                            response.message = "Failed to create new market"
                            response.description ="Failed"
            
                            res.status(500).send(response)
                    }
                })


            }
            else {
                response.statusCode ="99"
                response.message = "Paramter validation failed"
                response.description ="Failed"
            
                res.status(500).send(response)
            }



        }
        catch(er) {
            LogError("An error has occured", new Date(), er, "create Market", req.body.name)
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"
            
            res.status(500).send(response)
        }
    }

    static createFoodCategory(req, res, next) {
        try {
            const name =  typeof(req.body.name) == "string" ? req.body.name : false;

            if(name) {
                addMarketCategory(name, (result)=>{
                    if(result) {
                        response.statusCode ="00"
                        response.message = `${name} created`
                        response.description ="Success"

                        res.status(200).send(response)
                    }
                    else {
                        response.statusCode ="99"
                        response.message = `failed to create category`
                        response.description ="Failed"

                        res.status(400).send(response)
                    }
                })
            }
            else {
                response.statusCode ="99"
                response.message = `name is required`
                response.description ="Failed"

                res.status(400).send(response)
            }

        }
        catch (er) {
            LogError("An error has occured", new Date(), er, "create Market", "")
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"

            res.status(500).send(response)
        }
    }

    static async allCategories(req, res, next) {
        try {
            var results = await allMarketCategory()
            var responseData = [];

            for(var i=0;i<results.length;i++) {
                var current = results[i];
                var details = await readCategoryData(current);
                responseData.push(details.FoodCategory)
            }
            response.statusCode ="00"
            response.message = "Categories retrieved"
            response.description ="success"
            response.response = responseData

            res.status(200).send(response)

        }
        catch(er) {
            LogError("An error has occured", new Date(), er, "all Market Categories", "")
            response.statusCode ="99"
            response.message = er
            response.description ="An Error has occured"

            res.status(500).send(response)
        }
    }

    static deleteMarket(req, res, next) {
        const name = req.params.name

        //console.log(req.param)

        deleteData(name, (cb)=>{
            if(cb) {
                response.statusCode = "00";
                response.message = `${name} deleted`
                response.description = "Success"

                res.status(200).send(response)
            }
            else  {
                response.statusCode = "99";
                response.message = `${name} failed to delete`
                response.description = "Failed"

                res.status(200).send(response)
            }

        })
    }
}


module.exports = {MarketController:MarketController}