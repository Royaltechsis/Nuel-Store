import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    const fetchProduct = async () => {
      // Step 1: Try to find the product in the local product data
      let foundProduct = products.find((p) => p.id === parseInt(id)); // Make sure the ID comparison is correct

      // Step 2: If not found locally, fetch from Firestore
      if (!foundProduct) {
        try {
          const productRef = doc(db, 'products', id); // Adjust 'products' to match your Firestore collection name
          const productSnapshot = await getDoc(productRef);

          if (productSnapshot.exists()) {
            foundProduct = { id: productSnapshot.id, ...productSnapshot.data() };
            console.log("Product from Firestore:", foundProduct); // Log to check data structure
          } else {
            console.error("Product not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }

      // Step 3: Set the product state
      if (foundProduct) {
        setProduct({
          ...foundProduct,
          image: foundProduct?.image || foundProduct?.imageUrl || '/path/to/default-image.jpg',
          price: typeof foundProduct.price === 'number' ? foundProduct.price.toFixed(2) : Number(foundProduct.price.replace(/[$,]/g, '')).toFixed(2),
          name: foundProduct?.name || 'Unknown Product',
          category: foundProduct?.category || 'Miscellaneous'
        });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!product) {
    return <Typography variant="h4">Product not found!</Typography>;
  }

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="product-details-container">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} className="rounded-lg shadow-md w-full h-auto" />
        ) : (
          <Typography variant="body1">No image available</Typography>
        )}
      </div>
      <div className="product-info p-4">
        <Typography variant="h4" className="font-bold mb-2">
          {product.name}
        </Typography>
        <Typography variant="h6" className="mb-2">
          Category: {product.category}
        </Typography>
        <Typography variant="h6" className="mb-4">
          Price: ${product.price}
        </Typography>
        
        <div className="product-actions flex space-x-4">
          <Button variant="contained" color="primary" onClick={handleBuyNow}>
            Buy Now
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
