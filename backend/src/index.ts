import { Hono } from 'hono'
import user from './routers/user.js';
import blog from './routers/blog.js';
import upload from './routers/upload.js';

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
    origin: (origin) => {
      // allow dev + prod
      const allowed = ['http://localhost:5173', 'medium-lyart-ten.vercel.app']
      return allowed.includes(origin) ? origin : ''
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,  // very important
  })
)


app.route("api/v1/user", user);
app.route("api/v1/blog", blog);
app.route("api/v1/upload", upload);

export default app
