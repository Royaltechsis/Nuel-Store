// src/components/Products.js

import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../services/CartContext';
import { db } from '../firebase'; // Ensure you import db from your firebase config
import { collection, getDocs } from 'firebase/firestore';
import products from '../components/productdata'; // Import your products from productdata
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import cart icon

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useContext(CartContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]); // To store fetched products from Firestore
  const [selectedCategory, setSelectedCategory] = useState(''); // For category filtering
  const navigate = useNavigate(); // Hook for navigation

  // Fetch products from Firestore and merge with static data
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const firestoreProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Merge imported products with fetched products
      const allProducts = [...products, ...firestoreProducts];
      setFetchedProducts(allProducts);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} has been added to the cart!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Dynamically generate the categories from product data
  const categories = [...new Set(fetchedProducts.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = fetchedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sidebar for category filtering */}
        <aside className="w-full sm:w-1/4 p-4 bg-gray-100 rounded-lg sticky top-0 h-min">
          <h3 className="text-lg font-semibold">Categories</h3>
          <ul className="mt-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left py-2 px-4 rounded hover:bg-gray-200 ${selectedCategory === category ? 'bg-gray-300' : ''}`}
                >
                  {category}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left py-2 px-4 rounded hover:bg-gray-200 ${!selectedCategory ? 'bg-gray-300' : ''}`}
              >
                All Categories
              </button>
            </li>
          </ul>
        </aside>

        {/* Main product display area */}
        <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Featured Items</h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">Discover the latest and most popular gadgets in the market.</p>
          </div>

          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Stacked Card Display */}
          <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border rounded-lg shadow-sm p-4 cursor-pointer" 
                onClick={() => handleProductClick(product.id)} // Navigate to product details on click
              >
                <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-700">{product.description || product.category}</p>
                <p className="mt-2 text-xl font-bold text-gray-900">${product.price}</p>
                <div className="mt-4 flex items-center">
                  <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="flex items-center">
                    <ShoppingCartIcon className="mr-1" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success">{snackbarMessage}</Alert>
          </Snackbar>
        </div>
      </div>
    </section>
  );
}

export default Products;
