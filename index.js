const fs = require("fs");
const http = require('http');
const {promises} = require("fs");

const {readdir} = promises;
const normalizedPath = require("path").join(__dirname, "routes");
const PORT = 9000
function getFilesData(files) {
    return files.reduce((acc, file) => {
        const res = fs.readFileSync(`${normalizedPath}/${file}`,)
        const fileData = JSON.parse(res)
        Array.isArray(fileData) ? fileData.forEach(el => acc.push(el)) : acc.push(fileData);
        return acc;
    }, []);
}

async function generateJsonRoutes() {
    try {
        const files = await readdir(normalizedPath);
        if (!files.length) {
            console.warn(`There are no routes in the folder at ${normalizedPath}`);
        }
        const result = getFilesData(files)
        fs.writeFileSync('./routes.json', JSON.stringify(result))
    } catch (error) {
        console.log(error)
        console.log(error.message);
    }
}


const server = http.createServer((req, res) => {
    const routers = fs.readFileSync('./routes.json');
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

generateJsonRoutes().then(() => {
    server.listen(PORT, null, () => {
        console.log(`[server]: server running on port ${PORT}`);
    });
});

