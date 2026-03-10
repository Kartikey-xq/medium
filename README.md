## Overview
This is a medium-styled blogging app built with a fullstack Typescript architecture.
The application allows users to:
- Sign up and authenticate
- Create blog posts
- Read posts from other users
- Manage their own content

The project is structured as a modular full-stack application with separate frontend, backend, and shared modules.

## Tech-Stack
Frontend
- React
- TypeScript
- Vite

Backend
- Hono
- TypeScript
- PostgreSQL
- prisma ORM

Shared
- Zod (validation)
- Shared types between frontend and backend

## Architecture
User
  |
  v
Frontend (React + TypeScript)
  |
  | HTTP API Requests
  v
Backend (Hono)
  |
  | Validation (Zod from common/)
  | Business Logic
  v
Prisma ORM
PostgreSQL Database

## Project Structure

medium/
│
├── frontend/
│   React application responsible for UI and user interaction
│
├── backend/
│   Hono server responsible for API endpoints and business logic
│
├── common/
│   Shared schemas and types used by both frontend and backend

## Setup

Clone the repository

git clone https://github.com/kartikey-xq/medium

Install dependencies

cd backend
npm install

cd ../frontend
npm install

## Environment Variables

Backend requires the following variables:

DATABASE_URL=
JWT_SECRET=

## API Endpoints

### Auth

POST /signup
Creates a new user account

POST /signin
Authenticates user and returns JWT

### Posts

GET /posts
Fetch all blog posts

POST /posts
Create a new blog post

GET /posts/:id
Fetch a single post

## Future Improvements

- Implement comments
- Add post likes
- Improve authentication security
- Add pagination for posts
