const fs = require("fs");
const http = require('http');
const path = require("path")

class FakeServer {
    #rootJson = './routes.json'

    constructor(routesPath) {
        this.routesPath = routesPath;
    }

    get #server() {
        return http.createServer((req, res) => {
            const routers = fs.readFileSync(this.#rootJson);
            const routesData = JSON.parse(routers);
            const route = routesData.find(route => req.url === route.httpRequest?.path);
            const delay = route?.httpResponse?.delay || null;
            const status = route?.httpResponse?.status || 200;
            const contentType = route?.httpResponse?.headers?.['content-type'] || 'application/json';
            const allRoutesPaths = routesData.map(el => el.httpRequest.path)

            if (route) {
                res.writeHead(status, {'Content-Type': contentType});
                res.write(JSON.stringify(route.httpResponse.body.json));
                delay ? setTimeout(() => res.end(), delay) : res.end();
            } else if (req.url === '/all-routes') {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(allRoutesPaths));
            } else {
                res.end(JSON.stringify({
                    message: `Route with path "${req.url}" not found`
                }));
            }
            res.end();
        })
    }

    #getFilesData(files) {
        return files.reduce((acc, file) => {
            const res = fs.readFileSync(`${this.routesPath}/${file}`,)
            const fileData = JSON.parse(res)
            Array.isArray(fileData) ? fileData.forEach(el => acc.push(el)) : acc.push(fileData);
            return acc;
        }, []);
    }

    generateJsonRoutes() {
        const files = fs.readdirSync(this.routesPath);
        if (!files.length) {
            console.warn(`There are no routes in the folder at ${this.routesPath}`);
        }
        const result = this.#getFilesData(files)
        fs.writeFileSync(this.#rootJson, JSON.stringify(result))
        return this
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

const PORT = 9000
const normalizedPath = path.join(__dirname, "routes");
const fakeServer = new FakeServer(normalizedPath)

fakeServer.generateJsonRoutes().listen(PORT)

