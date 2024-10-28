import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../services/CartContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import products from './productdata';
import { Star } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom'; // Import Link

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useContext(CartContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
    addToCart(product);
    setSnackbarMessage(`${product.name} has been added to the cart!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredProducts = fetchedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">Our Featured Items</h2>
          <p className="mt-4 text-lg text-gray-600">Explore the latest and most popular gadgets on the market.</p>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <select
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:ring focus:ring-indigo-200"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Gadgets">Gadgets</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-10 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                {/* <p className="mt-2 text-sm text-gray-600">{product.description || product.category}</p> */}
                <p className="mt-4 text-sm font-semibold text-indigo-600">NGN{product.price}</p>
                
                {/* User Rating Display */}
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className={index < product.rating ? "text-yellow-500" : "text-gray-300"} />
                  ))}
                </div>

                {/* Add to Cart Button with Icon */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the link click
                    e.stopPropagation(); // Prevent the link click
                    handleAddToCart(product);
                  }}
                  className="mt-4 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                >
                  <ShoppingCartIcon className="mr-2" />
                </Button>
              </div>
            </Link>
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
