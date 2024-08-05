# Fun App

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/jrmoha/FunApp fun-app
 
cd fun-app
```

### Install Dependencies

```bash
yarn
```

### Setup Environment Variables

Copy the `.env.example` file to a new file named `.env`:

```bash
cp .env.example .env
```

### Create Database

Ensure that you have PostgreSQL running and create a new database named `fun_app`:

```sql
CREATE DATABASE fun_app;
```

## Running the App

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e
```

## Documentation

```bash
# access swagger documentation
$ http://localhost:3000/api
