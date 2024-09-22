"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';

interface SearchResult {
  url: string;
  snippet: string;
}

interface ImageResult {
  url: string;
}

interface GroqResponse {
  choices: Array<{ message: { content: string } }>;
  error?: { message: string };
}

const PeeKaboo: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const exampleQuestions = [
    "What is today's breaking news?",
    "Trends in computer science technology",
    "Software Testing Methods",
    "Why is interstellar the best movie?",
  ];

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);

  const typeWriterEffect = (text: string, element: HTMLElement, speed: number = 50) => {
    element.innerHTML = ''; // Clear previous content
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < text.length) {
        element.innerHTML += text[charIndex];
        charIndex++;
        setTimeout(typeNextChar, speed);
      }
    };

    typeNextChar();
  };

  const fetchGoogleSearchResults = async (query: string, numResults: number = 10): Promise<SearchResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numResults}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google search failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.items?.map((item: any) => ({
      url: item.link,
      snippet: item.snippet || '',
    })) || [];
  };

  const fetchGoogleImages = async (query: string, numImages: number = 5): Promise<ImageResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google image search failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.items?.map((item: any) => ({ url: item.link })) || [];
  };

  const generatePromptContext = (snippets: SearchResult[], images: ImageResult[]): string => {
    const snippetText = snippets.map((s, i) => `[citation:${i + 1}] ${s.snippet}`).join('\n\n');
    const imageText = images.map((_, i) => `Image ${i + 1}: [Description of relevance]`).join('\n');

    return `Answer the following question with detailed accuracy:

1. Provide a detailed, high-quality response to the question.
2. Include "Image Descriptions" at the end, explaining how each image is related.
3. Use citations in the format [citation:x] for text references.

Here are the snippets:
${snippetText}

Here are the images:
${imageText}`;
  };

  const fetchSummaryFromGroq = async (query: string, context: string): Promise<GroqResponse> => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: context },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) throw new Error(`Groq API request failed: ${response.statusText}`);
    return response.json();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');
    setImageResults([]);
    setError(null);

    try {
      const [snippets, images] = await Promise.all([
        fetchGoogleSearchResults(query),
        fetchGoogleImages(query),
      ]);

      setImageResults(images);
      const context = generatePromptContext(snippets, images);
      const groqResponse = await fetchSummaryFromGroq(query, context);

      const content = groqResponse.choices?.[0]?.message?.content || 'No summary available.';
      setSummary(content);
      setMetadata(`Query: ${query}\nModel: mixtral-8x7b-32768`);

      const summaryElement = document.getElementById('summary');
      if (summaryElement) {
        typeWriterEffect(content, summaryElement);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-['VT323', monospace] p-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-6xl text-center my-8 text-yellow-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PeeKaboo?
        </motion.h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center bg-[hsl(var(--card))] rounded-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query..."
              className="flex-grow p-4 bg-transparent text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none"
              required
            />
            <button 
              type="submit" 
              className="p-4 bg-yellow-500 text-black hover:bg-yellow-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" /> : <Search />}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center mb-8">
          {exampleQuestions.map((q, index) => (
            <motion.span
              key={index}
              className="inline-block m-2 px-4 py-2 bg-[hsl(var(--card))] rounded-full cursor-pointer hover:bg-yellow-500 transition-colors duration-200 text-yellow-500"
              onClick={() => setQuery(q)}
            >
              {q}
            </motion.span>
          ))}
        </div>

        {isLoading && <Loader className="mx-auto my-4 animate-spin" />}
        {error && <p className="text-red-500">{error}</p>}

        <div id="summary" className="mt-4"></div>
        {summary && <p className="mt-4">{summary}</p>}
        {metadata && <p className="mt-4 text-gray-500">{metadata}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {imageResults.map((image, index) => (
            <Image 
              key={index} 
              src={image.url} 
              alt={`Image ${index + 1}`} 
              width={300}
              height={300}
              className="w-full h-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeeKaboo;
