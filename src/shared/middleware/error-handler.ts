import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error instanceof Error ? error.message : 'Unexpected server error'
  });
};
