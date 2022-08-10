## Description

A tiny server app based on:
`NestJS, TypeScript, NodeJS, TypeORM, PostgreSQL`.

The app implements simple organization user structure management operations.
The following user roles are supported:
a. Administrator (top-most user)
b. Boss (any user with at least 1 subordinate)
c. Regular user (user without subordinates)

Each user except the Administrator must have a boss (strictly one).
The following REST API endpoints are exposed:
1. Register user
2. Authenticate as a user
3. Return list of users, taking into account the following:
- administrator should see everyone
- boss should see herself and all subordinates (recursively)
- regular user can see only herself
4. Change user's boss (only boss can do that and only for her subordinates; admin has all access)

## Endpoints

```
# Register a new user
[POST] Path: 'users/register', [BODY/JSON]: 
      {
        "username": "string",
        "password": "string, 6-16 char",
        "boss": "(optional field) uuid of the user who will be assigned as boss"
      }
      
# Authenticate (to get JWT token)
[POST] Path: 'auth/login', [BODY/JSON]:
      {
        "username": "string",
        "password": "string"
      }
      
# List all of the subordinates (or get all users if admin)
[GET] Path: 'users/subordinates', [Bearer Token]

# Assign boss to a user
[PATCH] Path: 'users/assignBoss', [Bearer Token], [BODY/JSON]:
      {
        "futureSubordinateId": "string/uuid",
        "futureBossId": "string/uuid"
      }
```

## Installation

```bash
1) Install node modules
$ npm install

2) Create an empty postgreSQL database (and pass its creds to the .env)

3) Create and populate .env (example provided)

4) Run migrations
$ npm run migration:run
  # The init migration file is already provided in src/orm/migrations.
  # If for some reason migrations fail to run, uncomment line 21 in src/app.module.ts 
  #   for automatic schema sync.
```

## Running the app

```bash
# run in watch mode
$ npm run start:dev
```

## Stay in touch

- Author - Artur Tsoklan <a.tsoklan@gmail.com>
