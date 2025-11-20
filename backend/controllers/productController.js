const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { title, category = '', brand = '', contents = [], coverImage = '', variationImages = [] } = req.body;
    
    console.log('Creating product with data:', { title, category, brand, contents });
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!category && !brand) {
      return res.status(400).json({ message: 'Either category or brand is required' });
    }
    
    let parsedContents;
    try {
      parsedContents = Array.isArray(contents) ? contents : (contents ? JSON.parse(contents) : []);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid contents format' });
    }
    
    const product = new Product({
      title: title.trim(),
      category: category ? category.trim() : '',
      brand: brand ? brand.trim() : '',
      coverImage,
      variationImages,
      contents: parsedContents
    });
    
    const savedProduct = await product.save();
    console.log('Product created successfully:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { title, category = '', brand = '', contents = [], coverImage = '', variationImages = [] } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!category && !brand) {
      return res.status(400).json({ message: 'Either category or brand is required' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, category, brand, contents, coverImage, variationImages },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message || 'Error updating product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};