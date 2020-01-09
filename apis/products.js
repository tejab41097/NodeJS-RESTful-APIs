const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Err, false);
    }
};

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {

    Product.find().select('_id name productImage').exec()
        .then(data => {
            res.status(200).json(data);
        }
        ).catch(error => {
            res.status(200).json({
                error: error
            });
        }
        );
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        res.status(201).json({
            message: 'Resource is created /products',
            product: product
        });
    }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

router.get('/:name', (req, res, next) => {
    Product.findById(req.params.name).exec().then(
        doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => console.log(err));
});

router.patch('/:name', checkAuth, (req, res, next) => {
    updateOpts = {};
    for (const opt of req.body) {
        updateOpts[opt.propName] = opt.value;
    }
    console.log(updateOpts);
    Product.updateOne({ _id: req.params.name }, { $set: updateOpts }, function (err, res2) {
        if (err) {
            console.log("Erorr " + err);
            res.status(500).json({
                message: err
            });
        } else
            console.log("Updated " + res);
        res.status(200).json({
            message: 'Updated /products/' + req.params.name
        });
    });
});

router.delete('/:name', checkAuth, (req, res, next) => {
    Product.remove({ _id: req.params.name }).exec().then(
        result => {
            res.status(200).json(result);
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err
            });
        }
    );
});

module.exports = router;
