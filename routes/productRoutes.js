const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - description
 *         - category
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         image:
 *           type: string
 *           description: Product image URL
 *       example:
 *         id: 1
 *         title: Leather Jacket
 *         price: 150
 *         description: High quality leather jacket
 *         category: fashion
 *         image: http://example.com/jacket.png
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

// Retrieve all products
router.get('/', async (_req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (_err) {
        res.status(500).send('Error retrieving products');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

// Retrieve a single product by numeric ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send('Invalid product ID');
        const prod = await Product.findOne({ id: id });
        if (!prod) return res.status(404).send('Product not found');
        res.json(prod);
    } catch (_err) {
        res.status(500).send('Error retrieving product');
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */

// Create a new product
router.post('/', async (req, res) => {
    try {
        // Ensure numeric id if provided
        if (req.body.id) req.body.id = Number(req.body.id);
        const newProd = new Product(req.body);
        await newProd.save();
        res.status(201).json(newProd);
    } catch (err) {
        // handle duplicate id or validation errors
        console.error(err?.message ? err.message : err);
        res.status(400).send('Error creating product');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

// Replace (update) an existing product by numeric ID
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send('Invalid product ID');
        if (req.body.id) req.body.id = Number(req.body.id);
        const updated = await Product.findOneAndUpdate(
            { id: id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).send('Product not found');
        res.json(updated);
    } catch (_err) {
        res.status(400).send('Error updating product');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

// Modify some fields of a product
router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send('Invalid product ID');
        if (req.body.id) req.body.id = Number(req.body.id);
        const updated = await Product.findOneAndUpdate(
            { id: id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).send('Product not found');
        res.json(updated);
    } catch (_err) {
        res.status(400).send('Error modifying product');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

// Delete a product by numeric ID
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send('Invalid product ID');
        const deleted = await Product.findOneAndDelete({ id: id });
        if (!deleted) return res.status(404).send('Product not found');
        res.sendStatus(204);
    } catch (_err) {
        res.status(400).send('Error deleting product');
    }
});

module.exports = router;