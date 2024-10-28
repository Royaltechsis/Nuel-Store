import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../services/CartContext';
import { Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  // Load quantities from local storage when the component mounts
  useEffect(() => {
    const savedQuantities = localStorage.getItem('quantities');
    if (savedQuantities) {
      setQuantities(JSON.parse(savedQuantities));
    }
  }, []);

  // Save quantities to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('quantities', JSON.stringify(quantities));
  }, [quantities]);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value < 1 ? 1 : value,
    }));
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    const quantity = quantities[item.id] || 1;
    return total + parseFloat(item.price.replace('$', '')) * quantity;
  }, 0);

  // Checkout function
  const handleCheckout = () => {
    const orderDetails = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantities[item.id] || 1,
    }));

    console.log('Order Details:', orderDetails);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto mt-10">
      <Typography variant="h4" className="mb-4 text-center">Your Cart</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1" className="text-center">Your cart is empty.</Typography>
      ) : (
        <div className="flex flex-wrap">
          <aside className="w-full lg:w-2/3 pr-4">
            <div className="bg-white shadow rounded-lg p-4">
              <table className="w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-2">Product</th>
                    <th className="text-center p-2">Quantity</th>
                    <th className="text-center p-2">Price</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 flex items-center">
                        <img src={item.image || item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                        <div>
                          <Typography variant="body1" className="font-semibold">{item.name}</Typography>
                          <Typography variant="body2" className="text-gray-600">{item.size} | {item.brand}</Typography>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <TextField
                          type="number"
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                          size="small"
                          className="w-20 mx-auto"
                        />
                      </td>
                      <td className="text-center p-2">
                        <Typography variant="body1" className="font-semibold">${item.price}</Typography>
                      </td>
                      <td className="text-right p-2">
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
          <aside className="w-full lg:w-1/3 mt-4 lg:mt-0">
            <div className="bg-white shadow rounded-lg p-4">
              <Typography variant="h6" className="mb-4">Summary</Typography>
              <div className="flex justify-between mb-2">
                <Typography variant="body1">Total price:</Typography>
                <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
              </div>
              {/* <div className="flex justify-between mb-2">
                <Typography variant="body1">Discount:</Typography>
                <Typography variant="body1 text-red-600">- $10.00</Typography>
              </div> */}
              <div className="flex justify-between mb-4 font-bold">
                <Typography variant="body1">Total:</Typography>
                <Typography variant="body1">${(totalPrice - 10).toFixed(2)}</Typography>
              </div>
              <Button variant="contained" color="primary" onClick={handleCheckout} className="w-full mb-2">
                Make Purchase
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate('/')} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
