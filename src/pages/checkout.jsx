// pages/Checkout.jsx
import React, { useContext } from 'react';
import { CartContext } from '../services/CartContext';
import { Typography, TextField, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';

function Checkout() {
  const { cart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = React.useState('creditCard');
  const [cardDetails, setCardDetails] = React.useState({ number: '', expiry: '', cvv: '' });

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate payment processing (you can integrate a real payment gateway here)
    console.log('Payment Method:', paymentMethod);
    console.log('Card Details:', cardDetails);
    alert('Payment processed successfully!'); // Placeholder for feedback
  };

  return (
    <div>
      <Typography variant="h4" className="mb-4">Checkout</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Typography variant="h6">Payment Method</Typography>
          <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
            <FormControlLabel value="creditCard" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
            <FormControlLabel value="bankTransfer" control={<Radio />} label="Bank Transfer" />
          </RadioGroup>

          {paymentMethod === 'creditCard' && (
            <div>
              <TextField
                label="Card Number"
                variant="outlined"
                fullWidth
                name="number"
                value={cardDetails.number}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Expiry Date (MM/YY)"
                variant="outlined"
                fullWidth
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <Button variant="contained" color="primary" type="submit">
            Complete Purchase
          </Button>
        </form>
      )}
    </div>
  );
}

export default Checkout;
