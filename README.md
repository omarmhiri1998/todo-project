# Todo List

A simple full-stack Todo List application built with **React** and **Node.js**.

The frontend is built with React and JavaScript.  
The backend uses Node.js without Express and follows an MVC structure.

Todo data is stored in a JSON file.

## Features

- Add a Todo
- Edit a Todo
- Delete a Todo
- Choose a category
- Add a date
- Mark a Todo as important
- Responsive mobile layout

## Technologies

- React
- JavaScript
- CSS
- Node.js
- MVC
- Fetch API
- JSON

## Project Structure

```text
todo-project/
├── frontend/
│   └── my-app/
└── backend/
    ├── routes/
    ├── controllers/
    ├── models/
    ├── views/
    └── data/
```

## Run the Project

### 1. Start the backend

```bash
cd backend
node server.js
```

The backend runs on:

```text
http://localhost:3070
```

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend/my-app
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

Open that address in your browser.

## Run Both with One Command

If `concurrently` is configured in the root `package.json`, you can start both frontend and backend from the project root with:

```bash
npm install
npm run dev
```
