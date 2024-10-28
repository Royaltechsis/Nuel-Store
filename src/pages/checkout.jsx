import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../services/CartContext';
import { Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, Modal, Box } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure auth is imported for user info

function Checkout() {
  const { cart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('Anonymous'); // State for username
  const [email, setEmail] = useState('No Email'); // State for email
  const [purchaseTime, setPurchaseTime] = useState(''); // State for purchase time
  const navigate = useNavigate();

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsModalOpen(true);

    // Get the authenticated user's details
    const user = auth.currentUser;
    setUsername(user?.displayName || 'Anonymous');
    setEmail(user?.email || 'No Email');

    // Get the current timestamp for purchase time
    const timestamp = new Date().toISOString();
    setPurchaseTime(timestamp); // Store the purchase time

    // Add each cart item to Firestore with user info
    try {
      const promises = cart.map(async (item) => {
        const purchaseData = {
          name: item.name,
          description: item.description,
          price: item.price,
          paymentMethod,
          quantity: item.quantity, // Adding the quantity field here
          purchasedat: timestamp, // Add timestamp here
          purchasedby: user?.email,
        };
        await addDoc(collection(db, 'purchases'), purchaseData);
      });

      await Promise.all(promises);
      console.log("All items added to 'purchases' collection successfully.");
    } catch (error) {
      console.error("Error adding items to purchases:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <div className="container w-8/12 justify-center mx-auto card m-20">
      <h1 className="mb-4 font-bold text-3xl text-center p-4">Checkout</h1>
      {cart.length === 0 ? (
        <h1 className="mb-4 text-center text-lg">Your cart is empty.</h1>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Typography variant="h6">Choose Payment Method</Typography>
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
          {paymentMethod === 'bankTransfer' && (
            <div>
              <span>Bank Name</span> : <span>Opay</span><br />
              <span>Account Name</span> : <span>Abiodun Oseni</span><br />
              <span>Account Number</span> : <span>9051787913</span><br />
              <div>* Send proof of payment to osenibunmi2023@gmail.com</div>
            </div>
          )}

          <Button variant="contained" color="primary" type="submit">
            Complete Purchase
          </Button>
        </form>
      )}

      {/* Order Summary Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal} className="flex items-center justify-center">
        <Box className="bg-white p-6 w-full max-w-lg relative rounded-lg shadow-lg">
          <div className="absolute top-4 right-4">
            <Button onClick={handleCloseModal} color="primary" variant="outlined">
              Close
            </Button>
          </div>

          <div className="absolute inset-0 flex justify-center items-center opacity-10 text-6xl font-bold text-gray-500">
            UNVERIFIED
          </div>

          <h2 className="text-center text-2xl font-bold mb-4">Order Receipt</h2>
          
          {/* Purchaser Info */}
          <div className="text-center mb-4">
            <p className="font-semibold">Purchased By:</p>
            <p>{username}</p>
            <p>{email}</p>
            <p className="font-semibold">Purchased At:</p>
            <p>{new Date(purchaseTime).toLocaleString()}</p> {/* Display formatted purchase time */}
          </div>

          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">{item.description}</p>
                </div>
                <p className="font-semibold">
                  NGN {parseFloat(item.price || 0).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="mt-6 flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>NGN {cart.reduce((total, item) => total + parseFloat(item.price || 0), 0).toFixed(2)}</p>
            </div>
          </div>

          <Button color="primary" variant="contained" className="mt-4 w-full" onClick={handleCloseModal}>
            Download as PDF
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Checkout;
