// src/app/(main)/peekaboo/page.tsx

"use client"; // Ensure this component is a client component

import React, { useState } from 'react';

const ImageSearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        
        if (!query.trim()) {
            setError('Please enter a search term.');
            return;
        }

        try {
            const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
            const apiUrl = `https://api.example.com/images?q=${encodeURIComponent(query)}&key=${apiKey}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch images.');

            const data = await response.json();
            setImages(data.images.map((img: { url: string }) => img.url));
        } catch (err) {
            setError(`Error fetching images: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    return (
        <div>
            <h1>Image Search</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for images"
                />
                <button type="submit">Search</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt="Image result" style={{ width: '200px', margin: '10px' }} />
                ))}
            </div>
        </div>
    );
};

export default ImageSearchPage;
