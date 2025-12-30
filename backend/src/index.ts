import { Hono } from 'hono'
import user from './routers/user.js';
import blog from './routers/blog.js';
import upload from './routers/upload.js';
import interactions from './routers/interactions.js';


import {cors} from 'hono/cors';

const app = new Hono<{
  Bindings: {        // Environment variables/bindings
    JWT_SECRET: string;
  },
  Variables: {       // Context variables you set during request
    userId: string;
  }
}>()

app.use(
  '*',
  cors({
    origin: (origin: string | undefined) => {
      if (!origin) return null; // no origin (like curl requests) omit the header, no browser in the picture, so no CORS implications
      const allowed = origin === 'http://localhost:5173' || origin.endsWith('.vercel.app');
      // Always allow localhost for dev
      // Allow any Vercel preview or production deployment
      if (allowed) return origin;


      // Otherwise block as browser will enforce CORS
      return null;
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.route("/api/v1/user", user);
app.route("/api/v1/blog", blog);
app.route("/api/v1/upload", upload);
app.route("/api/v1/interactions", interactions);

export default app
