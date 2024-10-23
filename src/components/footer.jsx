import React from 'react';
import { Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com' },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4">
        {/* Company Name/Logo */}
        <Typography variant="h6" className="font-bold mb-4 text-center">
          Nuel's Store
        </Typography>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="/" color="inherit">Home</Link>
          <Link href="/products" color="inherit">Products</Link>
          <Link href="/about" color="inherit">About</Link>
          <Link href="/contact" color="inherit">Contact</Link>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 mb-4">
          {socialLinks.map((link) => (
            <IconButton key={link.name} component="a" href={link.url} target="_blank" color="inherit">
              {link.icon}
            </IconButton>
          ))}
        </div>

        {/* Copyright Information */}
        <Typography variant="body2" className="text-center">
          © {new Date().getFullYear()} Nuel's Store. All Rights Reserved.
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
