var response = require("../models/responseObject")
export default class MarketController {
    static getAllMarket(req, res, next) {

        res.status(200).send(response)

    }
}