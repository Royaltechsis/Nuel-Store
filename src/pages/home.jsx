import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import ProductList from '../components/productlist'; // Import ProductList component
import ByCategory from '../components/bycategories'; // Import ByCategory component
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

function Home() {
  const [username, setUsername] = useState(''); // State to store the username

  // Fetch the authenticated user's username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid)); // Get the user document
        if (userDoc.exists()) {
          setUsername(userDoc.data().username); // Set the username
        }
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white py-20 text-center">
        <Typography variant="h2" className="font-bold mb-4">
          Welcome to Nuel's Store, {username || 'Guest'}!
        </Typography>
        <Typography variant="h6" className="mb-6">
          Discover the latest gadgets at unbeatable prices
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Shop Now
        </Button>
      </div>

      {/* Featured Products Section */}
      <div className="py-12 px-6">
        <Typography variant="h4" className="text-center font-bold mb-8">
          Featured Products
        </Typography>

        {/* Integrating Product List */}
        <ProductList /> {/* Display the product list with search and categories */}


        <ByCategory /> {/* Display the categories for filtering products */}
      </div>
    </div>
  );
}

export default Home;
