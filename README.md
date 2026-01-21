# Address Book (Angular + Node + MongoDB)

Simple CRUD address book with Angular frontend and an Express + MongoDB API.

## Prerequisites

- Node.js 18+ (tested with Node 22)
- MongoDB (local or Atlas)

## Environment variables

Create a `.env` file or set the variables in your shell:

```
MONGODB_URI=mongodb://127.0.0.1:27017/address_book
PORT=8080
```

If you use MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.

## Install dependencies

```
npm install
```

## Run the backend (API)

```
node app.js
```

The API runs at `http://localhost:8080/api/contacts`.

## Run the frontend (Angular)

```
ng serve
```

Open `http://localhost:4200/`.

The Angular dev server uses the proxy in `proxy.conf.json` to forward `/api` calls to the backend.

## Build (production)

```
ng build
```

Then serve the `dist/address-book` folder with the Node server.
