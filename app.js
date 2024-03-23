import express from 'express';
import { corsMiddleware } from './middleware/cors.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(corsMiddleware());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
})

app.listen(port, () => {
  console.log(`Server Listening on Port http://localhost:${port}`);
});