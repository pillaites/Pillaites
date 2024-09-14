import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read the contents of the events.txt file
    const filePath = path.join(process.cwd(), 'pages/api/events.txt');
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse the file contents into an array of events
    const events: Event[] = fileContents.trim().split('\n').map((line, index) => {
      const [title, date, description] = line.split('|').map(part => part.trim());
      return {
        id: String(index + 1),
        title,
        date,
        description,
      };
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error reading events file:', error);
    res.status(500).json({ error: 'Failed to read events' });
  }
}
