import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Cart icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Profile icon
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Function to toggle the drawer menu
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Monitor authentication state and fetch user role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white sm:pb-6 lg:pb-0 shadow-md fixed z-10 top-0 w-full bg-transparent">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
        {/* Large screen navigation */}
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex-shrink-0">
            <h1 className='text-2xl font-bold text-blue-600'>Nuel's Store</h1>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
            <Link to="/" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Home</Link>
            <Link to="/products" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Products</Link>
            <Link to="/about" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">About</Link>
            <Link to="/contact" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Contact</Link>
            {isAdmin && (
              <Link to="/admindashboard" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">
                Admin Dashboard
              </Link>
            )}
            <IconButton component={Link} to="/cart" className="text-black hover:text-blue-600">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton component={Link} to="/profile" className="text-black hover:text-blue-600">
              <AccountCircleIcon />
            </IconButton>
            {user ? (
              <Button onClick={handleLogout} className="text-base font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                Logout
              </Button>
            ) : (
              <Link to="/login" className="text-base font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started Now
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <IconButton
            edge="end"
            color="primary"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="sm:hidden"
          >
            <MenuIcon className="text-blue-500 sm:hidden" />
          </IconButton>
        </nav>

        {/* Mobile drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false) }>
          <div
            className="w-64 pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md sm:hidden"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List className="px-6 space-y-1">
              <ListItem button component={Link} to="/" className="text-base font-medium text-black hover:text-blue-600">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/products" className="text-base font-medium text-black hover:text-blue-600">
                <ListItemText primary="Products" />
              </ListItem>
              <ListItem button component={Link} to="/about" className="text-base font-medium text-black hover:text-blue-600">
                <ListItemText primary="About" />
              </ListItem>
              <ListItem button component={Link} to="/contact" className="text-base font-medium text-black hover:text-blue-600">
                <ListItemText primary="Contact" />
              </ListItem>
              {isAdmin && (
                <ListItem button component={Link} to="/admindashboard" className="text-base font-medium text-black hover:text-blue-600">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              )}
              <ListItem button component={Link} to="/cart" className="text-base font-medium text-black hover:text-blue-600">
                <IconButton>
                  <ShoppingCartIcon />
                </IconButton>
                <ListItemText primary="Cart" />
              </ListItem>
              {user ? (
                <ListItem button onClick={handleLogout} className="text-base font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                <ListItem button component={Link} to="/login" className="text-base font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                  <ListItemText primary="Get Started Now" />
                </ListItem>
              )}
            </List>
          </div>
        </Drawer>
      </div>
    </header>
  );
}

export default Header;
