// src/components/BrowseByCategories.js

import React from 'react';
import { Grid } from '@mui/material';
import CategoryCard from './categorycard';

const categories = [
    { name: 'Gadgets', description: 'Latest electronic devices' },
    { name: 'Accessories', description: 'Stylish accessories for your devices' },
    { name: 'Home Appliances', description: 'Smart devices for your home' },
    { name: 'Wearables', description: 'Tech that goes with you' },
    { name: 'Computers', description: 'Desktops and Laptops' },
];

function BrowseByCategories() {
    return (
        <section className="py-12 bg-gray-100">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center">Browse by Categories</h2>
                <Grid container spacing={2} justifyContent="center">
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.name}>
                            <CategoryCard category={category} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </section>
    );
}

export default BrowseByCategories;
