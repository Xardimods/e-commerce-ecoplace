import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://movies.com',
  'https://midu.dev',
  'https://ecoplace.3.us-1.fl0.io',
  'http://localhost:4321'
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);