const requestTemplate = {
    "httpRequest": {
        "path": "",
    },
    "httpResponse": {
        "delay": 0,
        "status": 200,
        "headers": {
            "Access-Control-Allow-Origin": [
                "*"
            ],
            "content-type": "application/json"
        },
        "body": {
            "json": {}
        }
    }
}
module.exports = {requestTemplate}
