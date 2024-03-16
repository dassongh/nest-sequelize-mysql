## Nest.js / MySQL / Sequelize

### Overview

A simple nest over fastify server.

### Technologies and tools

- TypeScript - main programming language
- Node.js - runtime for application
- Nest.js - backend framework (over fastify)
- MySQL - main database
- Sequelize - ORM
- Docker/Docker-compose - containerization tools

### Steps to run the project

- Clone repository
- `cd` into project directory
- run `npm i` or `npm ci` (package-lock is in the repository)
- run `npm run db:dev:up` to spin up dev db
- run `npm start`
- go to `http://127.0.0.1:4000/api` for swagger doc

### E2E tests

- run `npm run db:test:up`
- run `npm run test:e2e`
