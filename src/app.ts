import "./config/dotenv-config.js"
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from "./middleware/error-handler.js";
import authRouter from "./routes/auth-route.js";
import userRouter from "./routes/user-route.js";
// import productRoutes from './src/routes/productRoutes.js';
// import userRoutes from './src/routes/user-route.js';
// import orderRoutes from './src/routes/orderRoutes.js';
// import uploadRoutes from './src/routes/uploadRoutes.js';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use('/api/products', productRoutes);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);

// app.get('/api/config/paypal', (req, res) =>
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
// );

app.get('/api/products', (req, res) => {
  res.json({ hehe: 'haha' });
});
app.get('/api/hehe', async (req, res, next) => {
  try {
    throw Error("hehe jajaja")
  }
  catch (err) {
    next(err)
  }
});

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
