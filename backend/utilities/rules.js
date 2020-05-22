function isRequired(input) {
    if(input) {
        return true
    }
    else {
        return false
    }
}

function isEmpty(input) {
    var rinput = ""+input

    if(rinput.trim().length == 0 || rinput.trim().length < 1) {
        return true
    }
    else {
        return false;
    }
}

function meetPassword(input) {
    return input.trim().length >= 8;
}

function isString(input) {
    var rinput = typeof(input) == "string" ? true : false;

    return rinput
}

function isNumber(input) {
    var rinput = typeof(input) == "number" ? true : false;

    return rinput
}

module.exports = {
    meetPassword,
    isEmpty,
    isNumber,
    isRequired,
    isString
}