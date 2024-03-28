import express from 'express';
import morgan from 'morgan';
import { corsMiddleware } from './middleware/cors.js';
// import products from "./models/schema/products.json" assert { type: "json" };
import vendors from "./models/schema/vendors.json" assert { type: "json" };
import users from "./models/schema/users.json" assert { type: "json" };
import { bbddConection } from './models/config/conection.js';
import { ProductsRouter } from './routes/products.js';
import { CategoriesRouter } from './routes/categories.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(corsMiddleware());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/products', ProductsRouter);
app.use('/categories', CategoriesRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

app.listen(port, () => {
  console.log(`Server Listening on Port http://localhost:${port}`);
});