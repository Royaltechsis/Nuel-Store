import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import ProductList from '../components/productlist'; // Import ProductList component
import ByCategory from '../components/bycategories'; // Import ByCategory component
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import Bgc from '../assets/shop.webp'

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
    <div className="bg-gray-100 min-h-10/12">
      {/* Hero Section */}
      <div className="relative pt-12 bg-black text-center sm:pt-16 lg:py-36 xl:py-48">
    {/* Background Image for large screens */}
    <div className="absolute inset-0 block hero-bg">
        <img
            className="object-cover w-full h-full opacity-50"
            src={Bgc}
            alt="Hero background"
        />
    </div>

    {/* Hero Content */}
    <div className="relative max-w-7xl px-4 py-24 mx-auto sm:px-6 lg:px-8 hero-content">
        <div className="max-w-lg mx-auto lg:max-w-md lg:mx-0 lg:text-left">
            {/* Discount Offer */}
            {/* <Typography variant="h5" className="text-gray-100 font-bold">
                Use “WELCOME20” to enjoy 20% off your first purchase
            </Typography> */}
            
            {/* Welcome Message */}
            <Typography
                variant="h2"
                className="mt-3 text-white font-bold sm:mt-8 sm:text-5xl xl:text-7xl"
            >
                Welcome to Nuel's Store, {username || 'Guest'}!
            </Typography>
            
            {/* Subheading */}
            <Typography variant="h6" className="mt-3 text-gray-200">
                Discover the latest gadgets at unbeatable prices.
            </Typography>

            {/* Button */}
            <div className="mt-8 sm:mt-12">
                <Button
                    variant="contained"
                    size="large"
                    color='primary'
                    className=" hover:bg-purple-600 text-white px-8 py-3 font-bold rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                    href='./products'
                >
                    Shop Now
                </Button>
            </div>
        </div>

        {/* Mobile Background Image */}
        {/* <div className="mt-8 lg:hidden">
            <img
                className="w-full mx-auto rounded-lg shadow-lg"
                src="https://link-to-gadget-collage-stock-image.com"
                alt="Mobile hero background"
            />
        </div> */}
    </div>
</div>




      {/* Featured Products Section */}
      <div className="py-12 px-6">

        {/* Integrating Product List */}
        <ProductList /> {/* Display the product list with search and categories */}


        <ByCategory /> {/* Display the categories for filtering products */}
      </div>
    </div>
  );
}

export default Home;
