import React from 'react';

const Page = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const query = (e.target as any).searchInput.value;
        const results = document.getElementById('results')!;
        const summary = document.getElementById('summary')!;
        const metadata = document.getElementById('metadata')!;
        results.innerHTML = 'Processing query...';
        summary.textContent = '';
        metadata.textContent = '';

        Promise.all([
            searchWithGoogle(query),
            searchImagesWithGoogle(query)
        ]).then(([snippets, images]) => {
            results.innerHTML = '';

            if (images.length > 0) {
                images.forEach(image => {
                    const img = document.createElement('img');
                    img.src = image.url;
                    img.alt = 'Image';
                    img.style.width = 'auto';
                    img.style.flex = '1 1 auto';
                    results.appendChild(img);
                });
            } else {
                results.textContent = 'No images found.';
            }

            const answerPromptContext = setupGetAnswerPrompt(snippets, images);
            return requestGroq(query, answerPromptContext);
        }).then(data => {
            summary.innerHTML = `<h2>${query}</h2>`;
            const summaryContent = document.createElement('div');
            summary.appendChild(summaryContent);

            let content = '';
            if (data.choices && data.choices[0] && data.choices[0].message) {
                content = data.choices[0].message.content;
            } else if (data.error) {
                content = `Error: ${data.error.message}`;
            } else {
                content = 'No summary available.';
            }

            typeWriterFromJSON({ choices: [{ message: { content } }] }, summaryContent);

            metadata.innerHTML = '<h2>Metadata</h2>';
            metadata.innerHTML += `<p>Query: ${query}</p>`;
            metadata.innerHTML += `<p>Model: mixtral-8x7b-32768</p>`;
        }).catch(error => {
            console.error('Error:', error);
            results.textContent = `An error occurred while processing your query: ${error.message}`;
        });
    };

    const searchWithGoogle = (query: string, numSources = 15) => {
        const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_API_KEY}&cx=${CONFIG.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numSources}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => data.items ? data.items.map(item => ({
                url: item.link,
                snippet: item.snippet || '',
            })) : []);
    };

    const searchImagesWithGoogle = (query: string, numImages = 4) => {
        const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_API_KEY}&cx=${CONFIG.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;
        return fetch(url)
            .then(response => response.json())
            .then(data => data.items ? data.items.map(item => ({ url: item.link })) : []);
    };

    const setupGetAnswerPrompt = (snippets: any[], images: any[]) => {
        // Your implementation for generating prompt context goes here
        // ...
        return `Generated prompt context based on snippets and images.`;
    };

    const requestGroq = (query: string, context: string, maxTokens = 3000, model = "mixtral-8x7b-32768", temperature = 0.7) => {
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

        return fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
        }).then(response => response.json());
    };

    const typeWriterFromJSON = (jsonData: any, element: HTMLElement, speed = 5) => {
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

    return (
        <div className="container">
            <h1>PeeKaboo?</h1>
            <form id="searchForm" onSubmit={handleSubmit}>
                <input type="text" id="searchInput" name="q" placeholder="Enter your query..." required />
                <button type="submit">EXECUTE</button>
            </form>
            <div id="suggestions"></div>
            <div id="results"></div>
            <div id="summary"></div>
            <div id="metadata"></div>
            <footer>
                &copy; 2024 PeeKaboo | Powered by Illuminati
            </footer>
        </div>
    );
};

export default Page;
