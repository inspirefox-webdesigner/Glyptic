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
    const { title, category, contents = [] } = req.body;
    
    console.log('Creating product with data:', { title, category, contents });
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    let parsedContents;
    try {
      parsedContents = Array.isArray(contents) ? contents : (contents ? JSON.parse(contents) : []);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid contents format' });
    }
    
    const product = new Product({
      title: title.trim(),
      category: category.trim(),
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
    const { title, category, contents = [] } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, category, contents },
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