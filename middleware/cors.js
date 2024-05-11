import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4321',
  'http://34.201.92.59',
  'https://ecoplace-api.zeabur.app',
  'https://ecoplace.vercel.app',
  'https://movies.com',
  'https://midu.dev',
  'https://ecoplace.3.us-1.fl0.io',
  'https://ecoplaceapi-dev-eqsz.4.us-1.fl0.io',
  'ecoplaceapiimages.appspot.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  // Cabeceras permitidas en las solicitudes
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  // Cabeceras expuestas en las respuestas al cliente
  exposedHeaders: ['X-Auth-Token', 'Content-Type', 'Accept'],
  // Configura el tiempo (en segundos) que el resultado de una solicitud preflight puede ser caché
  maxAge: 86400, // 24 horas
})