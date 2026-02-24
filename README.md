🏢 Prameela WorkSphere
Role-Based Software Company Management Portal

Prameela WorkSphere is a full-stack web application designed to manage software company operations efficiently through a centralized role-based system.
The platform allows Admins, Employees, and Clients to collaborate, manage projects, request services, and communicate in real-time.

🚀 Features
🔐 Authentication & Authorization
Secure Login & Registration using JWT
Role-Based Access Control (Admin / Employee / Client)
Protected API Routes
👨‍💼 Admin Module
Manage Employees & Clients
Create & Assign Projects
View Service Requests
Monitor Team Activities
Company Management Dashboard
👩‍💻 Employee Module
View Assigned Projects
Update Project Status
Communicate with Clients
Manage Tasks
🧑‍💼 Client Module
Request Services
Track Project Progress
Send Messages
Upload Files
📂 Project Management
Create Projects
Assign Employees
Update Status
Track Timeline
💬 Real-Time Messaging
Socket.IO Based Communication
Instant Notifications
Role-Based Messaging
📁 File Upload Support
Upload Project Files
Secure Static File Storage
🛠️ Tech Stack
Frontend:
React.js
Vite
Axios
CSS
Backend:
Node.js
Express.js
MongoDB
JWT Authentication
Socket.IO
Database:
MongoDB
📁 Project Structure
Prameela_Software_solutions

backend
├── src
│ ├── config
│ ├── models
│ ├── routes
│ ├── scripts
│ ├── uploads
│ └── index.js
└── .env

frontend
├── src
└── .env

⚙️ Installation Guide
🔹 Clone the Repository
git clone
cd Prameela_Software_solutions

🔹 Backend Setup
cd backend
npm install

Create .env file inside backend:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prameela_software
JWT_SECRET= # 🏢 Prameela WorkSphere

Role-Based Software Company Management Portal
Prameela WorkSphere is a full-stack web application designed to manage software company operations efficiently through a centralized role-based system.
The platform allows Admins, Employees, and Clients to collaborate, manage projects, request services, and communicate in real-time.

🚀 Features
🔐 Authentication & Authorization
Secure Login & Registration using JWT
Role-Based Access Control (Admin / Employee / Client)
Protected API Routes
👨‍💼 Admin Module
Manage Employees & Clients
Create & Assign Projects
View Service Requests
Monitor Team Activities
Company Management Dashboard
👩‍💻 Employee Module
View Assigned Projects
Update Project Status
Communicate with Clients
Manage Tasks
🧑‍💼 Client Module
Request Services
Track Project Progress
Send Messages
Upload Files
📂 Project Management
Create Projects
Assign Employees
Update Status
Track Timeline
💬 Real-Time Messaging
Socket.IO Based Communication
Instant Notifications
Role-Based Messaging
📁 File Upload Support
Upload Project Files
Secure Static File Storage
🛠️ Tech Stack
Frontend:
React.js
Vite
Axios
CSS
Backend:
Node.js
Express.js
MongoDB
JWT Authentication
Socket.IO
Database:
MongoDB
📁 Project Structure
Prameela_Software_solutions

backend
├── src
│ ├── config
│ ├── models
│ ├── routes
│ ├── scripts
│ ├── uploads
│ └── index.js
└── .env

frontend
├── src
└── .env

⚙️ Installation Guide
🔹 Clone the Repository
git clone
cd Prameela_Software_solutions

🔹 Backend Setup
cd backend
npm install

Create .env file inside backend:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prameela_software
JWT_SECRET=e89a8b2f19e7c9bd3b888e5f5cd31667b63ae0a4a2421eea64b4fbef4ae078da3778b8cc328cfbecb8c726dd937ec5646f3c395394a8c66b9fd9598f8132d51e ADMIN_EMAIL=admin@prameela.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=Admin

Run Backend:

npm run dev

🔹 Seed Admin User
cd src/scripts
node seedAdmin.js

🔹 Frontend Setup
cd frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:5000/api

Run Frontend:

npm run dev

🌐 Application URLs
Frontend : http://localhost:5173
Backend : http://localhost:5000

🔑 Default Admin Login
Email : admin@prameela.com
Password : Admin@12345

📊 API Endpoints
/api/auth
/api/users
/api/services
/api/service-requests
/api/projects
/api/messages
📌 Future Enhancements
Email Notifications
Payment Integration
Report Generation
Task Tracking
AI-Based Analytics
👩‍💻 Developed By
Prameela Bevara
Full Stack Developer

📜 License
This project is developed for academic and demonstration purposes. ADMIN_EMAIL=admin@prameela.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=Admin

Run Backend:

npm run dev

🔹 Seed Admin User
cd src/scripts
node seedAdmin.js

🔹 Frontend Setup
cd frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:5000/api

Run Frontend:

npm run dev

🌐 Application URLs
Frontend : http://localhost:5173
Backend : http://localhost:5000

🔑 Default Admin Login
Email : admin@prameela.com
Password : Admin@12345

📊 API Endpoints
/api/auth
/api/users
/api/services
/api/service-requests
/api/projects
/api/messages
📌 Future Enhancements
Email Notifications
Payment Integration
Report Generation
Task Tracking
AI-Based Analytics
👩‍💻 Developed By
Prameela Bevara
Full Stack Developer

📜 License
This project is developed for academic and demonstration purposes.
