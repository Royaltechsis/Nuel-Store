import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../services/CartContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import products from '../components/productdata';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, isAuthenticated } = useContext(CartContext); // Ensure isAuthenticated is part of the context
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // To handle errors too
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const firestoreProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const allProducts = [...products, ...firestoreProducts];
      setFetchedProducts(allProducts);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (isAuthenticated) {
      addToCart(product);
      setSnackbarMessage(`${product.name} has been added to the cart!`);
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Please log in to add products to the cart.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const categories = [...new Set(fetchedProducts.map(product => product.category))];

  const filteredProducts = fetchedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden sm:block sm:w-1/4 lg:w-1/5 sticky top-20 h-auto">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="bg-gray-100 rounded-lg p-4">
            <li>
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 ${
                  !selectedCategory ? 'bg-gray-200' : ''
                }`}
              >
                All Categories
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 ${
                    selectedCategory === category ? 'bg-gray-200' : ''
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="block sm:hidden mb-4 sticky top-5">
          <label htmlFor="categorySelect" className="block text-lg font-semibold mb-2">Select Category</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

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

          <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border rounded-lg shadow-sm p-4 cursor-pointer" 
                onClick={() => handleProductClick(product.id)}
              >
                <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-700">{product.description || product.category}</p>
                <p className="mt-2 text-xl font-bold text-gray-900">NGN{product.price}</p>
                <div className="mt-4 flex items-center">
                  <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="flex items-center">
                    <ShoppingCartIcon className="mr-1" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>{snackbarMessage}</Alert>
          </Snackbar>
        </div>
      </div>
    </section>
  );
}

export default Products;
