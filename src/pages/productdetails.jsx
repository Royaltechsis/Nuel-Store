import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import products from '../components/productdata';
import { CartContext } from '../services/CartContext'; // Adjust the import path

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // Access the addToCart function
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <Typography variant="h4">Product not found!</Typography>;
  }

  const handleBuyNow = () => {
    addToCart(product); // Add the product to the cart
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <Typography variant="h4" className="font-bold mb-4">
        {product.name}
      </Typography>
      <Typography variant="h6" className="mb-4">
        Category: {product.category}
      </Typography>
      <Typography variant="h6" className="mb-4">
        Price: {product.price}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        className="mt-4"
        onClick={handleBuyNow} // Call the handleBuyNow function
      >
        Buy Now
      </Button>

      {/* Back Button */}
      <Button
        variant="outlined"
        color="secondary"
        className="mt-4 ml-4"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
};

export default ProductDetails;
