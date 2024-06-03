# Blog
This repository contains a full-stack application with a Node.js backend and a Vite + React frontend.

## Table of Contents

- [Backend Setup](#backend-setup)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [Frontend Setup](#frontend-setup)
  - [Requirements](#requirements-1)
  - [Installation](#installation-1)
  - [Running the Application](#running-the-application)
- [Common Issues](#common-issues)
- [Additional Scripts](#additional-scripts)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Contributing](#contributing)

## Backend Setup

### Requirements

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB (or any other database you're using)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2. Navigate to the `backend` directory:

    ```bash
    cd your-repository/backend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the `backend` directory and add your environment variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/your-database
    JWT_SECRET=your_jwt_secret
    ```

### Running the Server

1. Start the server:

    ```bash
    npm start
    ```

2. The backend server should now be running on `http://localhost:5000`.

## Frontend Setup

### Requirements

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

### Installation

1. Navigate to the `frontend` directory:

    ```bash
    cd ../frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Start the Vite development server:

    ```bash
    npm run dev
    ```

2. The frontend application should now be running on `http://localhost:5173`.

## Common Issues

### Backend

- **MongoDB Connection**: Ensure MongoDB is running and the connection URI in your `.env` file is correct.
- **Port Conflicts**: Ensure the port specified in the `.env` file is not being used by another application.

### Frontend

- **Port Conflicts**: Ensure the port `5173` is not being used by another application.
- **Environment Variables**: Ensure any necessary environment variables are correctly set up.

## Additional Scripts


## Contributing

If you wish to contribute to this project, please follow the standard GitHub fork-and-pull request workflow:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.


