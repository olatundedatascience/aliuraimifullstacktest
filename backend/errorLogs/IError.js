class IError extends Error {
    constructor(msg, methodName) {
        super(msg)
        this.message = msg,
        this.methodName = methodName

        
    }
}

module.exports = IError