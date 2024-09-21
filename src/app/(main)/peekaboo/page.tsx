"use client";

import React, { useState, useEffect, FormEvent } from 'react';
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
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

const PeeKaboo: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const questions = [
    "What is today's breaking news?",
    "Trends in computer science technology",
    "Software Testing Methods",
    "Why is interstellar the best movie?"
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const typeWriterEffect = (content: string, element: HTMLElement, speed: number = 5) => {
    const sentences = content.split('\n\n');
    element.innerHTML = '';

    let i = 0;
    let j = 0;

    function type() {
      if (i < sentences.length) {
        const currentSentence = sentences[i];
        const p = document.createElement('p');
        element.appendChild(p);

        function typeChar() {
          if (j < currentSentence.length) {
            p.innerHTML += currentSentence.charAt(j);
            j++;
            requestAnimationFrame(typeChar);
          } else {
            j = 0;
            i++;
            setTimeout(type, speed * 2);
          }
        }

        typeChar();
      }
    }

    type();
  };

  const searchWithGoogle = async (query: string, numSources: number = 15): Promise<SearchResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numSources}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((item: any) => ({
        url: item.link,
        snippet: item.snippet || '',
      }));
    }
    return [];
  };

  const searchImagesWithGoogle = async (query: string, numImages: number = 4): Promise<ImageResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((item: any) => ({
        url: item.link,
      }));
    }
    return [];
  };

  const setupGetAnswerPrompt = (snippets: SearchResult[], images: ImageResult[]): string => {
    const snippetsText = snippets.map((s, i) => `[citation:${i + 1}] ${s.snippet}`).join('\n\n');
    
    return `Answer all this\n\n${snippetsText}\n\nHere are the images:\n` +
      images.map((_, index) => `Image ${index + 1}: [Description]`).join('\n') + 
      "\n\nUse the provided information to create a comprehensive and engaging response.";
  };

  const requestGroq = async (query: string, context: string): Promise<GroqResponse> => {
    const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
    
    const requestBody = {
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: context },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    };

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    return response.json();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResults([]);
    setSummary('');
    setMetadata('');
    setIsLoading(true);

    try {
      const [snippets, images] = await Promise.all([
        searchWithGoogle(query),
        searchImagesWithGoogle(query),
      ]);
      
      setResults(images);
      const answerPromptContext = setupGetAnswerPrompt(snippets, images);
      const data = await requestGroq(query, answerPromptContext);

      if (data.choices?.[0]?.message?.content) {
        const content = data.choices[0].message.content;
        setSummary(content);
        
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
          typeWriterEffect(content, summaryElement);
        }
      } else if (data.error) {
        setSummary(`Error: ${data.error.message}`);
      } else {
        setSummary('No summary available.');
      }
      setMetadata(`Query: ${query}\nModel: mixtral-8x7b-32768`);
    } catch (error) {
      console.error('Error:', error);
      setSummary(`An error occurred: ${(error as Error).message || 'Unknown error'}`);
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
          {questions.map((q, index) => (
            <motion.span
              key={index}
              className="inline-block m-2 px-4 py-2 bg-[hsl(var(--card))] rounded-full cursor-pointer hover:bg-yellow-500 transition-colors duration-200 text-yellow-500"
              onClick={() => setQuery(q)}
            >
              {q}
            </motion.span>
          ))}
        </div>
        {isLoading && <Loader className="mx-auto my-4" />}
        <div id="summary" className="mt-4"></div>
        {summary && <p className="mt-4">{summary}</p>}
        {metadata && <p className="mt-4 text-gray-500">{metadata}</p>}
        
        {/* Render Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {results.map((image, index) => (
            <img 
              key={index} 
              src={image.url} 
              alt={`Image ${index + 1}`} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeeKaboo;
