import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError
    ? error.message
    : 'Something went wrong on our side. Please try again shortly.';

  if (!(error instanceof HttpError)) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
