# Budgetwise - Personal Finance Dashboard

Welcome to **Budgetwise**, a personal finance management application. This project includes both a **frontend** built with Vue.js and Quasar, and a **backend** using Node.js with Express. Follow these instructions to set up the project.

## Prerequisites
Make sure you have the following software installed:
- **Node.js** (version >= 14.x) - [Download Node.js here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn** for managing dependencies
- **Git** for version control
- **Docker** for postgres db
- 
## Getting Started
1. Clone the Repository: Start by cloning the repository: `git clone https://github.com/yourusername/budgetwise.git` and navigate into the directory with `cd budgetwise`.

2. Setting Up the Frontend: Navigate to the frontend directory with `cd frontend`, then install the dependencies using `npm install`. Run the frontend development server with `quasar dev`. By default, the frontend will be available at **http://localhost:9000/**.

3. Setting Up the Backend: Navigate to the backend directory with `cd ../backend`, install the dependencies using `npm install`. Create a `.env` file in the backend directory and add the following content: `PORT=5000`. Run the backend development server with `npm run dev`. By default, the backend will be available at **http://localhost:5000/**.

4. Running the Full Project: To run both the **frontend** and **backend**, open two terminal tabs or windows. In the first terminal, navigate to the `frontend` directory and run `quasar dev`. In the second terminal, navigate to the `backend` directory and run `npm run dev`.

## Project Structure
- **frontend/**: Contains the Vue + Quasar code for the client-side application.
  - **public/index.html**: Main HTML file for Vue mounting.
  - **src/pages/**: Main pages like Home, Login, Signup, Dashboard.
  - **src/services/api.js**: Axios configuration for API requests to the backend.
  - **App.vue** and **main.js**: Main root component and entry file for the Vue app.
- **backend/**: Contains the Node.js + Express code for the server-side API.
  - **app.js**: Main entry point for the server.
  - **routes/userRoutes.js**: Contains API routes for user operations like signup and login.
  - **.env**: Environment variables file to configure the backend.

## Useful Commands
### Frontend
- Install dependencies: `npm install`
- Run development server: `quasar dev`
- Build for production: `quasar build`
### Backend
- Install dependencies: `npm install`
- In the backend directory run `docker compose up -d` to start database
- Run development server: `npm run dev`
- Start server for production: `npm start`
- 
## Additional Commands
- To view if docker postgres container is running or any additional containers, use command `docker ps`
- To stop postgres db from running when using docker, in the backend directory run command `docker compose down`

## Seeding/Initializing Database (You should only do this once)
- Postgres username / password and database name located in `backend/docker-compose.yml` file under _environment_.
- After confirming docker postgres container is running, using the above command you can then copy and paste the commands in file `database/db_init.sh`
in sequence in your terminal. This will load the initial database schema and data.
- To connect your postgres db client such as **pg admin** or any other compatible client for postgres use connection string `0.0.0.0` with port `5423` and user/pass from `docker-compose.yml` file.

## Troubleshooting
- **Ports in Use**: Ensure that **port 9000** (frontend) and **port 5000** (backend) are available.
- **CORS Issues**: The backend uses **CORS** to allow requests from the frontend. Verify CORS settings in `backend/app.js` if needed.
- **Frontend Failing to Connect to Backend**: Make sure the backend server is running on **http://localhost:5000/** and that the frontend is configured to connect to this URL.
- **Docker issues** Docker Postgres container uses postgres default port 5432, with container host url as 0.0.0.0. full connection string _0.0.0.0:5432_


## Contribution Guidelines
1. **Clone Repository to your local**.
2. **Create a new branch** for your feature: `git checkout -b feature/your-feature-name`.
3. **Add your changes to stage commit**:  `git add .` _adds all changes_  *OR* `git add <FILENAME>` Adds only the file specified.
4. **Commit your changes**: `git commit -m "Add new feature"`.
5. **Push to your branch**: `git push origin feature/your-feature-name`.
6. **Open a Pull Request**.

## Helpful links (additional information)
- [Docker Compose Commands](https://devopscycle.com/blog/the-ultimate-docker-compose-cheat-sheet/#download-the-ultimate-docker-compose-cheat-sheet)
- [Postgres Client](https://www.pgadmin.org/down) _download the version for your computer, macOS ,Windows, Linux_