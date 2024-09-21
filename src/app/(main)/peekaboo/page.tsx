"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

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

  const questions = [
    "What is today's breaking news?",
    "Trends in computer science technology",
    "Software Testing Methods",
    "Why is interstellar the best movie?"
  ];

  useEffect(() => {
    // Load font
    const link = document.createElement('link');
    link.href = 'https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff2';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const typeWriterFromJSON = (jsonData: GroqResponse, element: HTMLElement, speed: number = 5) => {
    const content = jsonData.choices[0].message.content;
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
    setSummary('Processing query...');
    setMetadata('');

    try {
      const [snippets, images] = await Promise.all([searchWithGoogle(query), searchImagesWithGoogle(query)]);
      setResults(images);

      const answerPromptContext = setupGetAnswerPrompt(snippets, images);
      const data = await requestGroq(query, answerPromptContext);

      let content = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content;
      } else if (data.error) {
        content = `Error: ${data.error.message}`;
      } else {
        content = 'No summary available.';
      }

      setSummary(content);
      setMetadata(`Query: ${query}\nModel: mixtral-8x7b-32768`);

      // Use typewriter effect
      const summaryElement = document.getElementById('summary');
      if (summaryElement) {
        typeWriterFromJSON({ choices: [{ message: { content } }] }, summaryElement);
      }
    } catch (error) {
      console.error('Error:', error);
      setSummary(`An error occurred while processing your query: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container">
      <h1>PeeKaboo?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
          required
        />
        <button type="submit">EXECUTE</button>
      </form>
      <div id="suggestions">
        {questions.map((q, index) => (
          <span key={index} className="question" onClick={() => setQuery(q)}>
            {q}
          </span>
        ))}
      </div>
      <div id="results">
        {results.length > 0 ? (
          results.map((image, index) => (
            <Image key={index} src={image.url} alt={`Image ${index + 1}`} width={200} height={200} />
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
      <div id="summary">
        <h2>{query}</h2>
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      </div>
      <div id="metadata">
        <h2>Metadata</h2>
        <pre>{metadata}</pre>
      </div>
      <footer>
        &copy; 2024 PeeKaboo | Powered by Illuminati
      </footer>
    </div>
  );
};

export default PeeKaboo;
