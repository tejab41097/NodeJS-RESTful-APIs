const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(
            result => {
                res.status(200).json(result);
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        );
});

router.post('/', checkAuth, (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order.save().then(
        result => {
            res.status(201).json({
                message: 'Resource is created /orders'
            });
        }
    ).catch(err => {
        res.status(500).json({
            message: err
        });
    });

});

router.get('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET to /orders/' + req.params.name
    });
});

router.patch('/:name', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: 'Updated ' + req.params.name
    });
});

router.delete('/:name', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: 'Deleted ' + req.params.name
    });
});

module.exports = router;