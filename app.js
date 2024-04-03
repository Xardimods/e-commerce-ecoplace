import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.js';
import { db } from './models/config/conection.js';
import { ProductsRouter } from './routes/products.js';
import { CategoriesRouter } from './routes/categories.js';
import { UserRouter } from './routes/users.js';
import { RolesRouter } from './routes/roles.js';
import { CartRouter } from './routes/carts.js';
import { OrderRouter } from './routes/orders.js';
import { SalesRouter } from './routes/sales.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');
app.use(corsMiddleware());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser());

app.use('/products', ProductsRouter);
app.use('/categories', CategoriesRouter);
app.use('/users', UserRouter);
app.use('/roles', RolesRouter);
app.use('/carts', CartRouter);
app.use('/orders', OrderRouter);
app.use('/sales', SalesRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the EcoPlace API!'
  });
});

app.listen(port, () => {
  console.log(`Server Listening on Port http://localhost:${port}`);
});