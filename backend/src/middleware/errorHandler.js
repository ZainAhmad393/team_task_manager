const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  if (err.code === 'P2002') return res.status(409).json({ error: 'A record with this value already exists.' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found.' });
  if (err.code === 'P2003') return res.status(400).json({ error: 'Related record not found.' });
  if (err.type === 'validation') return res.status(400).json({ error: err.message, errors: err.errors });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Something went wrong. Please try again.'
      : message,
  });
};

const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
};

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, notFound, ApiError };