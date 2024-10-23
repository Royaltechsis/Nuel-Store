import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../services/CartContext';
import { db } from '../firebase'; // Ensure you import db from your firebase config
import { collection, getDocs } from 'firebase/firestore';
import products from './productdata'; // Import your products from productdata

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useContext(CartContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]); // To store fetched products from Firestore
  const [selectedCategory, setSelectedCategory] = useState(''); // For category filtering

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

  // Filtering products based on search term and category
  const filteredProducts = fetchedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
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

        {/* Category Filter Dropdown */}
        <div className="mt-4">
          <select
            className="border rounded-md p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Gadgets">Gadgets</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Stacked Card Display */}
        <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg shadow-sm p-4">
              {/* Use the correct property for image URL */}
              <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-700">{product.description || product.category}</p>
              <p className="mt-2 text-xl font-bold text-gray-900">${product.price}</p>
              <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)} className="mt-4">Add to Cart</Button>
            </div>
          ))}
        </div>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </div>
    </section>
  );
}

export default Products;
