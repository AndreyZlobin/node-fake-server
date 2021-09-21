const querystring = require('querystring');
const url = require('url');


const mapOfMethods = {
    POST: "POST",
    GET: "GET"
}

function getQueryParams(reqUrl) {
    const parsed = url.parse(reqUrl);
    return querystring.parse(parsed.query);
}

function getRouteParams(req) {
    const parsed = req.url.split('/');
    return parsed[parsed.length - 1] || ''
}

function getMethod(req) {
    return req.method
}

function isPost(req) {
    return getMethod(req) === mapOfMethods.POST
}

function isGet(req) {
    return getMethod(req) === mapOfMethods.GET
}

function unauthorized(res, contentType = 'application/json') {
    res.writeHead(401, {'Content-Type': contentType});
    res.write(JSON.stringify({
        message: `unauthorized`
    }));
    return res.end()
}

module.exports = {
    getMethod,
    isPost,
    isGet,
    unauthorized,
    mapOfMethods,
    getQueryParams,
    getRouteParams
}
