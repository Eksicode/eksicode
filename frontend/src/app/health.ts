import { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
    status: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
    res.status(200).json({ status: 'ok' });
}