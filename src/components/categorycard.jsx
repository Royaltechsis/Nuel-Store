// src/components/CategoryCard.js
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Icon } from '@mui/material'; // Import Material UI's Icon

const CategoryCard = ({ category }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center text-center">
                <Icon className="text-blue-600" style={{ fontSize: 48 }}>
                    {category.icon}
                </Icon>
                <Typography variant="h5" className="mt-2">{category.name}</Typography>
                <Typography variant="body2" color="text.secondary">{category.description}</Typography>
                <Button
                    component={Link}
                    to={`/products?category=${category.name}`} // Set category as a query parameter
                    variant="contained"
                    color="primary"
                    className="mt-4"
                >
                    Shop Now
                </Button>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;
