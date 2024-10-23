import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Header from './components/header.jsx';
import Login from './pages/login.jsx';
import Shop from './pages/shop.jsx';
import Signup from './pages/signup.jsx';
import ProductDetails from './pages/productdetails.jsx';
import Products from './pages/products.jsx';
import Cart from './pages/cart.jsx';
import Checkout from './pages/checkout.jsx';
import Footer from './components/footer.jsx';
import AdminDashboard from './pages/admindashboard.jsx'; // Ensure correct import
import { auth } from './firebase'; 
import { CartProvider } from './services/CartContext'; 
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from './firebase'; // Import Firestore instance

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Fetch user role from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === 'admin'); // Check if user is admin
                }
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
        });
  
        return () => unsubscribe();
    }, []);
  
    return (
        <CartProvider>
            <Router>
                <Header />
                <main className="flex-grow">
                    <Routes>
                        {!isAuthenticated ? (
                            <>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/products/:id" element={<ProductDetails />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                
                                {/* Correct the admin route */}
                                <Route 
                                    path="/admindashboard" // Ensure path matches the one you're trying to access
                                    element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
                                />
                                {/* Redirect logged-in users from login and signup pages */}
                                <Route path="/login" element={<Navigate to="/" />} />
                                <Route path="/signup" element={<Navigate to="/" />} />
                            </>
                        )}
                    </Routes>
                </main>
                <Footer />
            </Router>
        </CartProvider>
    );
}

export default App;
