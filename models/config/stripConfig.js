import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Usa la versión de la API de Stripe que prefieras
});

export default stripe;