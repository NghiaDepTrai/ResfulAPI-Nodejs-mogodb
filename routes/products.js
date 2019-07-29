const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name password price _id ')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        password: doc.password,
                        price: doc.price,
                        _id: doc._id,
                        repuest: {
                            Type: 'GET',
                            url: 'http://localhost:3000/products' + doc._id
                        }
                    };
                })
            };
            console.log(response);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        password: req.body.password,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'created product successfull',
            createdProduct: {
                name: result.name,
                price: result.price,
                password: result.password,
                _id: result._id,
                repuest: {
                    Type: 'GET',
                    url: 'http://localhost:3000/products' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/:productID', (req, res, next) => {
    const _id = req.params.productID;
    Product.findById(_id)
        .exec()
        .then(doc => {
            console.log('from database', doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            }
            else {
                res.status(404).json({ message: "No valid entry found for provided ID" });
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

router.patch('/:productID', (req, res) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'product updated',
                request: {
                    Type: 'GET',
                    url: 'http://localhost:3000/products' + _id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            });
        });
});

router.delete('/:productID', (req, res) => {
    const id = req.params.productID;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'product deleted',
                request: {
                    Type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
module.exports = router;