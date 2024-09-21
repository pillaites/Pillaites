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

  const typeWriterEffect = (content: string, element: HTMLElement) => {
    const sentences = content.split('\n\n');
    element.innerHTML = '';
    let i = 0;
    let j = 0;

    const type = () => {
      if (i < sentences.length) {
        const currentSentence = sentences[i];
        const p = document.createElement('p');
        element.appendChild(p);

        const typeCharacter = () => {
          if (j < currentSentence.length) {
            p.innerHTML += currentSentence.charAt(j);
            j++;
            requestAnimationFrame(typeCharacter);
          } else {
            i++;
            j = 0;
            setTimeout(type, 200); // Pause before typing the next sentence
          }
        };

        typeCharacter();
      }
    };

    type();
  };

  const searchWithGoogle = async (query: string, numSources: number = 15): Promise<SearchResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numSources}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.items ? data.items.map((item: any) => ({
      url: item.link,
      snippet: item.snippet || '',
    })) : [];
  };

  const searchImagesWithGoogle = async (query: string, numImages: number = 4): Promise<ImageResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;
    const response = await fetch(url);
    const data = await response.json();

    return data.items ? data.items.map((item: any) => ({ url: item.link })) : [];
  };

  const setupGetAnswerPrompt = (snippets: SearchResult[], images: ImageResult[]): string => {
    return `Answer all this

1. A detailed, paragraphed, comprehensive answer to the question.
2. Image Descriptions: Describe each image's relevance to the topic.

Here are the provided citations: ${snippets.map((s, i) => `[citation:${i + 1}] ${s.snippet}`).join('\n\n')}
`;
  };

  const requestGroq = async (query: string, context: string): Promise<GroqResponse> => {
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

    return response.json();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResults([]);
    setSummary('');
    setMetadata('');
    setIsLoading(true);

    try {
      const [snippets, images] = await Promise.all([searchWithGoogle(query), searchImagesWithGoogle(query)]);
      setResults(images);
      const answerPromptContext = setupGetAnswerPrompt(snippets, images);
      const data = await requestGroq(query, answerPromptContext);

      if (data.choices?.[0]?.message?.content) {
        setSummary(data.choices[0].message.content);
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
          typeWriterEffect(data.choices[0].message.content, summaryElement);
        }
      } else if (data.error) {
        setSummary(`Error: ${data.error.message}`);
      } else {
        setSummary('No summary available.');
      }
      setMetadata(`Query: ${query}\nModel: mixtral-8x7b-32768`);
    } catch (error) {
      console.error('Error:', error);
      setSummary(`An error occurred: ${error.message}`);
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
              className="inline-block m-2 px-4 py-2 bg-[hsl(var(--card))] rounded-full cursor-pointer hover:bg-yellow-500 transition-colors duration-200"
              onClick={() => setQuery(q)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {q}
            </motion.span>
          ))}
        </div>
        {results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Related Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square bg-[hsl(var(--card))] rounded-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img 
                    src={image.url} 
                    alt={`Image ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {summary && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl mb-4">Summary</h2>
            <div id="summary" className="bg-[hsl(var(--card))] p-6 rounded-lg text-yellow-300" />
          </motion.div>
        )}
        {metadata && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl mb-4">Metadata</h2>
            <pre className="bg-[hsl(var(--card))] p-6 rounded-lg whitespace-pre-wrap">{metadata}</pre>
          </motion.div>
        )}
        <footer className="text-center text-[hsl(var(--muted-foreground))] mt-8">
          &copy; 2024 PeeKaboo | Powered by Illuminati
        </footer>
      </div>
    </div>
  );
};

export default PeeKaboo;
