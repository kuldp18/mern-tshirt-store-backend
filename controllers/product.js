const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductByID = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: 'Failed to find the product in the DB.',
      });
    }
    req.product = product;
    next();
  });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'Problem with image.',
      });
    }
    // destructuring the fields
    const { name, description, price, category, stock, size } = fields;
    // console.log(`
    //     name:${name},
    //     description:${description},
    //     price:${price},
    //     category:${category},
    //     stock:${stock},
    //     size:${size}`);
    if (!name || !description || !price || !category || !stock || !size) {
      return res.status(400).json({
        error:
          'Please provide all the required fields for the product like name, description, price, category, stock, size.',
      });
    }
    let product = new Product(fields);
    // handle files
    if (file.photo) {
      if (file.photo.size >= 3000000) {
        return res.status(400).json({
          error: 'Image size too big, should be less than 3 MB.',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Failed to save product in DB.',
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedPdt) => {
    if (err) {
      return res.status(400).json({
        error: `Failed to delete the product:${deletedPdt} from the DB.`,
      });
    }
    res.json({
      message: 'Successfully deleted the product.',
      deletedPdt,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'Problem with image.',
      });
    }
    // destructuring the fields
    const { name, description, price, category, stock, size } = fields;

    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle files
    if (file.photo) {
      if (file.photo.size >= 3000000) {
        return res.status(400).json({
          error: 'Image size too big, should be less than 3 MB.',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Failed to update product in DB.',
        });
      }
      res.json(product);
    });
  });
};
// product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: 'No product found.',
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to get categories.',
      });
    }
    res.json(categories);
  });
};

// middlewares
exports.productPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $inc: {
            stock: -prod.count,
            sold: +prod.count,
          },
        },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: 'Bulk operations failed to fetch products.',
      });
    }
    next();
  });
};
