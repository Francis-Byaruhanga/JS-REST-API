const app = require('../server');

function listRoutes(app) {
    const routes = [];
    if (!app._router || !app._router.stack) return routes;
    app._router.stack.forEach((layer) => {
        if (layer.route && layer.route.path) {
            routes.push({ path: layer.route.path, methods: Object.keys(layer.route.methods) });
        } else if (layer.name === 'router' && layer.regexp) {
            routes.push({ mount: layer.regexp.toString() });
        }
    });
    return routes;
}

console.log(JSON.stringify(listRoutes(app), null, 2));
console.log('Raw stack:');
app._router.stack.forEach((layer, idx) => {
    const info = {
        idx,
        name: layer.name,
        keys: Object.keys(layer).filter(k => typeof layer[k] !== 'function')
    };
    console.log(info);
});
