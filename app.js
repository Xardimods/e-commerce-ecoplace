import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import products from "./models/schema/products.json" assert { type: "json" };
import vendors from "./models/schema/vendors.json" assert { type: "json" };
import users from "./models/schema/users.json" assert { type: "json" };

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

app.get('/products', (req, res) => {
  res.json(products)
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/vendors', (req, res) => {
  res.json(vendors)
})

app.listen(port, () => {
  console.log(`Server Listening on Port http://localhost:${port}`);
});