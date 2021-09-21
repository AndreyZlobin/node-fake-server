const fs = require("fs");
const http = require('http');
const path = require("path")
const {mapOfMethods, unauthorized, getMethod} = require("./utils");

class FakeServer {
    #rootJson = './routes.json'
    #methods = mapOfMethods
    static #instance = null

    constructor(routesPath) {
        if (FakeServer.#instance) {
            return FakeServer.#instance
        }
        FakeServer.#instance = this;

        this._routesPath = routesPath;
        this.url = Math.random()
    }

    get #server() {
        return http.createServer((req, res) => {
            const routers = fs.readFileSync(this.#rootJson);
            const reqMethod = getMethod(req);
            const routesData = JSON.parse(routers);

            let route = routesData.find(route => {
                const routeMethod = route.httpRequest.method || this.#methods.GET
                return req.url === route.httpRequest?.path
                    && routeMethod === reqMethod
            });

            const delay = route?.httpResponse?.delay || null;
            const status = route?.httpResponse?.status || 200;
            const contentType = route?.httpResponse?.headers?.['content-type'] || 'application/json';
            const allRoutesPaths = routesData.map(el => el.httpRequest.path);
            const isAuth = route?.httpResponse?.auth && !req.headers.authorization;

            if (isAuth) {
                return unauthorized(res);
            }

            if (route) {
                res.writeHead(status, {'Content-Type': contentType});
                res.write(JSON.stringify(route.httpResponse.body.json));
                delay ? setTimeout(() => res.end(), delay) : res.end();
            } else if (req.url === '/all-routes') {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(allRoutesPaths));
            } else {
                res.writeHead(500, {'Content-Type': contentType});
                res.end(JSON.stringify({
                    message: `Route with path "${req.url}" not found`
                }));
            }
        })
    }

    #getFilesData(files) {
        return files.reduce((acc, file) => {
            const res = fs.readFileSync(`${this._routesPath}/${file}`,)
            const fileData = !!res.toString() ? JSON.parse(res) : null
            fileData && Array.isArray(fileData) ? fileData.forEach(el => acc.push(el)) : acc.push(fileData);
            return acc;
        }, []);
    }

    generateJsonRoutes() {
        const files = fs.readdirSync(this._routesPath);
        if (!files.length) {
            console.warn(`There are no routes in the folder at ${this._routesPath}`);
        }
        const result = this.#getFilesData(files)
        fs.writeFileSync(this.#rootJson, JSON.stringify(result))
        return this
    }

    removeAll() {
        try {
            const files = fs.readdirSync(this._routesPath);
            const unlinkPromises = files.map(filename => fs.unlinkSync(`${this._routesPath}/${filename}`));
            console.log(`[DONE]: Dir ${this._routesPath} is clean`)
            return Promise.all(unlinkPromises);
        } catch (err) {
            console.log(err?.message || "[Error]: Error on remove files")
        }
    }

    remove(filename) {
        const pathToFile = `${this._routesPath}/${filename}`
        const isFileExist = fs.existsSync(pathToFile)
        if (isFileExist) {
            fs.unlinkSync(`${this._routesPath}/${filename}`)
            console.log(`[DONE]: File ${filename} has been removed`)
        } else {
            console.log(`File ${filename} does not exist`)
        }
    }

    /**
     * port {Number} server port
     * host {Number} server host
     *  callback {Function} callback
     * */
    listen(port, host, callback) {
        this.#server.listen(port, host, callback ? callback : () => {
            console.log(`[server]: server running on port ${PORT}`);
        });
    }
}

const PORT = 9000;
const normalizedPath = path.join(__dirname, "routes");
const fakeServer = new FakeServer(normalizedPath);

fakeServer.generateJsonRoutes().listen(PORT);
module.exports = {FakeServer}
