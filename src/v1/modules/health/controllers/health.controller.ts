import type { RequestHandler } from 'express';

export const getHealth: RequestHandler = (_req, res) => {
  res.json({ success: true, service: 'whazzonline-backend', status: 'ok', timestamp: new Date().toISOString() });
};
