const request = require('supertest');
const express = require('express');

// Mock the Product model module before requiring routes
jest.mock('../models/product.model', () => {
    const m = {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn()
    };

    function Prod(data) {
        Object.assign(this, data);
        this.save = jest.fn().mockResolvedValue(this);
    }

    Prod.find = m.find;
    Prod.findOne = m.findOne;
    Prod.findOneAndUpdate = m.findOneAndUpdate;
    Prod.findOneAndDelete = m.findOneAndDelete;

    return Prod;
});

const Product = require('../models/product.model');
const productRoutes = require('../routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Product routes', () => {
    beforeEach(() => {
        Product.find.mockReset();
        Product.findOne.mockReset();
        Product.findOneAndUpdate.mockReset();
        Product.findOneAndDelete.mockReset();
    });

    test('GET /products returns array', async () => {
        Product.find.mockResolvedValue([{ id: 1, title: 't', price: 10 }]);
        const res = await request(app).get('/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].id).toBe(1);
    });

    test('GET /products/:id returns product', async () => {
        Product.findOne.mockResolvedValue({ id: 1, title: 't', price: 10 });
        const res = await request(app).get('/products/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
    });

    test('POST /products creates product', async () => {
        const prodData = { id: 2, title: 'x', price: 5 };
        // Using the mocked constructor: it sets save() to resolve to the instance
        const res = await request(app).post('/products').send(prodData);
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(2);
    });

    test('DELETE /products/:id returns 204 when deleted', async () => {
        Product.findOneAndDelete.mockResolvedValue({ id: 3 });
        const res = await request(app).delete('/products/3');
        expect(res.statusCode).toBe(204);
    });
});
