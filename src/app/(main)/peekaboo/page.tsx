"use client"; // Mark the component as a client component

import React, { useState } from 'react';

interface Image {
    url: string;
}

const Page: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Image[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const images = await searchImagesWithGoogle(query);
            setResults(images);
        } catch (err) {
            setError('Error fetching images');
        }
    };

    const searchImagesWithGoogle = async (query: string): Promise<Image[]> => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Use your environment variable here
        const response = await fetch(`https://api.example.com/images?q=${encodeURIComponent(query)}&key=${apiKey}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.images.map((img: { url: string }) => ({ url: img.url }));
    };

    return (
        <div>
            <h1>Image Search</h1>
            <form onSubmit={handleSubmit}>
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
                {results.length > 0 ? (
                    results.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt="Image"
                            style={{ width: '200px', margin: '10px' }}
                        />
                    ))
                ) : (
                    <p>No images found.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
