const express = require('express');
const mongoose = require('mongoose');
const setupDocs = require('./config/docs');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


// Configure Express to parse JSON bodies
app.use(express.json());

// API documentation setup (mount docs before routes to avoid conflicts)
console.log('Setting up API docs at /docs...');
setupDocs(app);

// Mount routes so endpoints are under /products
console.log('Mounting product routes at /products...');
app.use('/products', productRoutes);
console.log('Product routes mounted at /products');

// Debug: list registered routes (for troubleshooting /docs availability)
try {
    const routes = [];
    if (app._router && app._router.stack) {
        app._router.stack.forEach((layer) => {
            if (layer.route && layer.route.path) {
                routes.push(Object.keys(layer.route.methods).join(',').toUpperCase() + ' ' + layer.route.path);
            } else if (layer.name === 'router' && layer.regexp) {
                routes.push('MOUNT ' + layer.regexp);
            }
        });
    }
    console.log('Registered routes:', routes);
} catch (e) {
    console.error('Error listing routes:', e);
}

// Connect to MongoDB and start server only when run directly
if (require.main === module) {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://byaruhangafrancis23_db_user:5jbFnMwycEfq40ke@cluster0.50542m1.mongodb.net/?appName=Cluster0';
    mongoose.connect(mongoUri, {
        ssl: true,
        retryWrites: true,
        w: 'majority',
        retryReads: true
    })
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err);
            if (err.code === 'EAI_AGAIN') {
                console.log('DNS resolution failed. Check your network connection and DNS settings.');
            }
            process.exit(1);
        });

    // Start the server
    app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
    });
}

module.exports = app;