// const {getRouteParams} = require("./utils");
// const routeParams = getRouteParams(req);
// let rUrl = '';
// if (req.url.endsWith('/')) rUrl = rUrl.substring(0, req.url.length-1);
// console.log(rUrl)
// let route = routesData.find(route => {
//     const routeMethod = route.httpRequest.method || this.#methods.GET
//     return rUrl === route.httpRequest?.path
//         && routeMethod === reqMethod
//         || route.httpRequest?.path.includes(route.meta?.param) && routeMethod === reqMethod
// });
// if (route?.meta?.ref) {
//     const routeByMeta = routesData.find(refRoute =>
//         refRoute.httpRequest?.path === route.meta?.ref
//         && refRoute.httpRequest?.method === this.#methods.GET
//     )
//
//     let r = routeByMeta.httpResponse.body.json;
//     let rClone = {...routeByMeta.httpResponse.body.json};
//     let validFields = false;
//     const targetFields = route.meta?.targetFields || [];
//     const lastField = targetFields[targetFields.length - 1];
//     const firstField = targetFields[0];
//     targetFields.forEach(el => {
//         if (el in r && r[el]) {
//             validFields = true
//             r = r[el]
//         } else {
//             validFields = false
//             console.error(`[ERROR]: Field ${el} does not exist in ref data - all fields ${JSON.stringify(Object.keys(rClone))}`)
//         }
//     })
//     if (validFields && lastField) {
//         const currentDataItem = r.find(el => `${el[route.meta?.param]}` === `${routeParams}`);
//         route.httpResponse.body.json[firstField] = currentDataItem;
//     }
// }
