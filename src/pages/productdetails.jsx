import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, CircularProgress, Card, CardContent, CardMedia, Grid, Snackbar, Alert } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore setup
import { CartContext } from '../services/CartContext';
import products from '../components/productdata'; // Import local product data

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      let foundProduct = products.find((p) => p.id === parseInt(id));

      if (!foundProduct) {
        try {
          const productRef = doc(db, 'products', id);
          const productSnapshot = await getDoc(productRef);

          if (productSnapshot.exists()) {
            foundProduct = { id: productSnapshot.id, ...productSnapshot.data() };
            console.log("Product from Firestore:", foundProduct);
          } else {
            console.error("Product not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }

      if (foundProduct) {
        setProduct({
          ...foundProduct,
          image: foundProduct?.image || foundProduct?.imageUrl || '/path/to/default-image.jpg',
          price: typeof foundProduct.price === 'number' ? foundProduct.price.toFixed(2) : Number(foundProduct.price.replace(/[$,]/g, '')).toFixed(2),
          name: foundProduct?.name || 'Unknown Product',
          category: foundProduct?.category || 'Miscellaneous',
          description: foundProduct?.description || 'No description available'
        });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!product) {
    return <Typography variant="h4" align="center">Product not found!</Typography>;
  }

  const handleBuyNow = () => {
    const isAuthenticated = true; // Replace with actual authentication check
    if (isAuthenticated) {
      addToCart(product);
      setSnackbarMessage(`${product.name} has been added to the cart!`);
      setSnackbarSeverity('success');
      navigate('/cart');
    } else {
      setSnackbarMessage('Please log in to add products to the cart.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="p-4">
        <Grid item xs={12} sm={4} md={4}>
          <Card elevation={4} className="rounded-lg shadow-lg overflow-hidden">
            <CardMedia
              component="img"
              alt={product.name}
              height="200"
              image={product.image}
              title={product.name}
              className="object-cover" />
            <CardContent className="text-center">
              <Typography variant="h5" className="font-bold mb-1 text-gray-800">
                {product.name}
              </Typography>
              <Typography variant="subtitle1" className="mb-1 text-gray-600">
                Category: <span className="font-medium">{product.category}</span>
              </Typography>
              <Typography variant="h6" className="mb-2 text-gray-800">
                Price: <span className="text-green-500">${product.price}</span>
              </Typography>
              <Typography variant="body2" className="mb-3 text-gray-700">
                {product.description}
              </Typography>
              <div className="flex justify-center space-x-2">
                <Button variant="contained" color="primary" onClick={handleBuyNow} className="hover:bg-blue-700 transition duration-200">
                  Buy Now
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} className="hover:bg-gray-200 transition duration-200">
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetails;
