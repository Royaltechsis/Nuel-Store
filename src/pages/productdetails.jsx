import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import products from '../components/productdata'; 
import { CartContext } from '../services/CartContext'; 

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const product = products.find((p) => p.id === parseInt(id));

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
        <img src={product.image} alt={product.name} className="rounded-lg shadow-md w-full h-auto" />
      </div>
      <div className="product-info p-4">
        <Typography variant="h4" className="font-bold mb-2">
          {product.name}
        </Typography>
        <Typography variant="h6" className="mb-2">
          Category: {product.category}
        </Typography>
        <Typography variant="h6" className="mb-4">
          Price: ${Number(product.price.replace(/[$,]/g, '')).toFixed(2)}
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
