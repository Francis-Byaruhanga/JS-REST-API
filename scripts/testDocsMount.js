const express = require('express');
const setupDocs = require('../config/docs');

const app = express();
setupDocs(app);

console.log('App router present?', !!app._router);
if (app._router && app._router.stack) {
    app._router.stack.forEach((layer, i) => {
        console.log(i, layer.name, layer.regexp && layer.regexp.toString(), layer.route && layer.route.path);
    });
}
