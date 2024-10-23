import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import your Firebase auth
import { signOut } from 'firebase/auth'; // Import signOut function
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Import your Firestore instance

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null); // State to hold user info
  const [isAdmin, setIsAdmin] = useState(false); // State to determine if user is admin
  const navigate = useNavigate(); // Use navigate to redirect after logout

  // Function to toggle the drawer menu
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Links for navigation
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      setIsAdmin(false); // Clear admin state
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Monitor authentication state and fetch user role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid)); // Get the user document
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin'); // Check if user is admin
        }
      } else {
        setIsAdmin(false); // Reset admin state if no user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  // Function to render navigation links
  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <ListItem button key={link.title} component={Link} to={link.path}>
          <ListItemText primary={link.title} />
        </ListItem>
      ))}
      {isAdmin && (
        <ListItem button component={Link} to="/admindashboard">
          <ListItemText primary="Admin Dashboard" />
        </ListItem>
      )}
      {user && (
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </>
  );

  return (
    <>
      {/* AppBar for the header */}
      <AppBar position="static" className="bg-blue-600">
        <Toolbar className="flex justify-between">
          {/* Logo */}
          <Typography variant="h6" className="text-white font-bold">
            Nuel's Store
          </Typography>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {renderNavLinks()}
          </div>

          {/* Hamburger Menu for Mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-haspopup="true"
            onClick={toggleDrawer(true)}
            className="md:hidden"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          className="w-64"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {renderNavLinks(true)}
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default Header;
