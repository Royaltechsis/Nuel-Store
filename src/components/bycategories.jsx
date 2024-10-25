// src/components/BrowseByCategories.js

import React from 'react';
import Slider from 'react-slick'; // Import React Slick
import { Icon } from '@mui/material'; // Import Material UI's Icon
import CategoryCard from './CategoryCard';


import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';


const categories = [
    { name: 'Gadgets', description: 'Latest electronic devices', icon: 'devices' },
    { name: 'Accessories', description: 'Stylish accessories for your devices', icon: 'checkroom' },
    { name: 'Home Appliances', description: 'Smart devices for your home', icon: 'home' },
    { name: 'Wearables', description: 'Tech that goes with you', icon: 'fitness_center' },
    { name: 'Computers', description: 'Desktops and Laptops', icon: 'computer' },
];

function BrowseByCategories() {
    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Adjust as needed
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="py-12 bg-gray-100">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center mb-6">
                    Browse by Categories
                </h2>
                <Slider {...settings}>
                    {categories.map((category) => (
                        <div key={category.name} className="px-2">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default BrowseByCategories;
