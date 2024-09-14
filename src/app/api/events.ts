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
    const filePath = path.join(process.cwd(), 'src/api/events.txt');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const events: Event[] = fileContents.split('\n').map((line, index) => {
      const [title, date, description] = line.split('|');
      return {
        id: String(index + 1),
        title: title.trim(),
        date: date.trim(),
        description: description.trim(),
      };
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error reading events file:', error);
    res.status(500).json({ error: 'Failed to read events' });
  }
}
