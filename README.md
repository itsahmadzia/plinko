# Non-Deterministic Server-Side Game

## Project Description
This project is a simple non-deterministic server-side game designed to prevent middle-man attacks. It features a React-based front end and an Express-based backend. The game mechanics involve adding balls to a canvas, where each ball's starting position and multiplier are determined by server calls. This ensures that the ball only hits the specified multiplier. Each multiplier has an associated probability, and the game introduces 10 danger levels to increase the challenge and complexity.

## Project Structure
The project is organized into two main directories:

### 1. `vite-project`
This directory contains the front end of the application, developed using React. It leverages a canvas element for efficient rendering of the game elements.

Key components:
- **React**: The JavaScript library for building user interfaces.
- **Canvas**: Used for rendering game elements quickly and efficiently.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.

### 2. `backend`
This directory contains the backend of the application, developed using Express. The backend is responsible for storing probabilities and other sensitive data, and it handles the logic for returning multipliers and starting positions for the game.

Key components:
- **Express**: A minimal and flexible Node.js web application framework.
- **Database**: (Optional) Could be used for storing probabilities and game state information.

## How to Run

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (https://nodejs.org/)
- npm (Node Package Manager, comes with Node.js)

### Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/non-deterministic-game.git
   cd non-deterministic-game
   ```

2. **Install dependencies for both the front end and backend:**
   - For the front end (`vite-project`):
     ```sh
     cd vite-project
     npm install
     ```

   - For the backend (`backend`):
     ```sh
     cd ../backend
     npm install
     ```

3. **Run the development servers:**
   - For the front end (`vite-project`):
     ```sh
     npm run dev
     ```

   - For the backend (`backend`):
     ```sh
     npm run dev
     ```

4. **Check the connection settings:**
   Ensure that the front end is configured to communicate with the backend. If your backend server is hosting on a different port number, update the connection settings in the front end configuration file (e.g., `vite.config.js` or an environment variable).

## Game Mechanics
- **Ball Addition**: When a ball is added, a server call is made to retrieve the multiplier and starting position.
- **Multipliers**: Each multiplier has a defined probability. The server ensures the ball is created at the exact coordinates to hit the specified multiplier.
- **Danger Levels**: The game introduces 10 danger levels to increase the challenge. Each level affects the probabilities and game dynamics.

## Troubleshooting
- **Port Conflicts**: Ensure no other applications are using the ports specified for the front end and backend.
- **Connection Issues**: Verify that the front end is correctly pointing to the backend server. Check network settings and CORS configurations if necessary.
- **Dependency Issues**: Ensure all dependencies are installed correctly by running `npm install` in both directories.



Feel free to contribute to this project by creating issues or pull requests on the GitHub repository. For any questions or support, contact me at mahmad2004a8@gmail.com.
