// src/components/categorycard.js
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent>
                <Typography variant="h5">{category.name}</Typography>
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
