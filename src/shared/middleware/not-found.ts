import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'We could not find that API endpoint.' });
};
