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
    let currentSentence = '';
    let isTyping = false;

    function type() {
      if (i < sentences.length) {
        if (!isTyping) {
          currentSentence = sentences[i];
          isTyping = true;
          const p = document.createElement('p');
          element.appendChild(p);
        }

        const p = element.lastElementChild as HTMLParagraphElement;
        const char = currentSentence.charAt(j);
        p.innerHTML += char;
        j++;

        if (j >= currentSentence.length) {
          j = 0;
          i++;
          isTyping = false;
          setTimeout(type, speed * 2);
        } else {
          requestAnimationFrame(type);
        }
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

  const getSnippetsForPrompt = (snippets: SearchResult[]): string => {
    return snippets.map((s, i) => `[citation:${i + 1}] ${s.snippet}`).join('\n\n');
  };

  const setupGetAnswerPrompt = (snippets: SearchResult[], images: ImageResult[]): string => {
    const startingContext = `Answer all this

1. A detailed, paragraphed, comprehensive answer to the question. It must be accurate, high-quality, and expertly written in a positive, interesting, and engaging manner. The answer should be informative and in the same language as the user question. Aim for at least 300 words in your response.

2. After your main answer, provide a section titled "Image Descriptions" where you describe how each of the provided images relates to the topic. Use the format: "Image X: [Brief description and relevance to the topic]"

For all parts of your response, you will be provided with a set of citations to the question. Each will start with a reference number like [citation:x], where x is a number. Always use the related citations and cite the citation at the end of each sentence in the format [citation:x]. If a sentence comes from multiple citations, please list all applicable citations, like [citation:2][citation:3].

Here are the provided citations:`;

    const imageContext = "\nHere are descriptions of relevant images:\n" +
      images.map((_, index) => `Image ${index + 1}: [Brief description and relevance to the topic]`).join('\n');

    const finalContext = "Use the provided information to create a comprehensive and engaging response.";

    return `${startingContext}\n\n${getSnippetsForPrompt(snippets)}\n\n${imageContext}\n\n${finalContext}`;
  };

  const requestGroq = async (query: string, context: string, maxTokens: number = 3000, model: string = "mixtral-8x7b-32768", temperature: number = 0.7): Promise<GroqResponse> => {
    const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
    
    const requestBody = {
      model: model,
      messages: [
        { role: "system", content: context },
        { role: "user", content: query }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
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
      const [snippets, images] = await Promise.all([searchWithGoogle(query), searchImagesWithGoogle(query)]);
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
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      setSummary(`An error occurred: ${errorMessage}`);
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
      </div>
    </div>
  );
};

export default PeeKaboo;
