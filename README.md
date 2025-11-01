# React Code Editor












Overview

React Code Editor is a fully responsive online IDE built with React that allows users to write, edit, and preview code in real time.
I built this project using Sandpack Editor for live preview functionality and implemented a file explorer sidebar for smooth file management — just like a desktop IDE.

The application features authentication with protected routes, data persistence, and cloud sync across devices. It also includes a secure backend using Node.js, Express, and MongoDB.

Features
Frontend (React)

Live preview code editor built using Sandpack
.

Sidebar-based file explorer for managing multiple files.

Authentication system with Signup and Login pages.

Protected Routes to prevent unauthorized access.

LocalStorage for persistent user sessions.

Fully responsive design for desktop, tablet, and mobile screens.

Backend (Node.js + Express)

REST API for handling user authentication and project management.

Encrypted password storage using bcrypt.

User and file data stored securely in MongoDB Compass.

Ability for users to access and edit saved projects from any device.

Tech Stack
Category	Technology
Frontend	React, Sandpack, React Router
Backend	Node.js, Express.js
Database	MongoDB (Compass)
Authentication	JWT (JSON Web Token), bcrypt
Storage	LocalStorage
Version Control	Git & GitHub
Getting Started
Prerequisites

Make sure you have the following installed:

Node.js (v18+)

npm or yarn

MongoDB Compass

Installation
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# Navigate into the project directory
cd <your-repo-name>

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

Run the Project
# Start backend server
cd server
npm start

# Start frontend
cd ../client
npm start


Then open:

http://localhost:3000

Project Structure
React-Code-Editor/
│
├── Frontend/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # AppLayout,CodeEditor,Sidebar etc
│   │   ├── pages/          # Login, Signup
│   │   ├── context/        # editorContext
│   │   └── hooks/          # useLocalStorage
│   │  
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── package.json
│    
├── Backend/                # Backend (Node.js + Express)
│   ├── models/             # User & File schemas
│   ├── middleware/         # Auth 
│   ├── index.js
│   └── package.json
│                           // I defined routes in the index.js but you can use Routes and controllers 
└── README.md

Security Highlights

Passwords hashed securely using bcrypt before storage.

JWT authentication for secure and verifiable user sessions.

Protected routes prevent unauthorized access.

LocalStorage used only for non-sensitive session persistence.

Future Improvements

Add syntax highlighting themes (light/dark mode).

Implement project sharing with public/private access links.

Add cloud file storage (AWS S3 or Firebase).

Support for multiple programming languages.

Enable real-time collaborative editing using Socket.io.

Screenshots

You can add screenshots here later to showcase your project UI.

Example:

![Editor Screenshot](assets/editor-screenshot.png)
![Login Page](assets/login-page.png)

License

This project is licensed under the MIT License — see the LICENSE
 file for details.

Author

Mohamed Sabah MV
Cybersecurity & Software Developer | React, Node.js, AWS
Email: sabahmv0770@gmail.com
GitHub: https://github.com/SabahMuhamed
