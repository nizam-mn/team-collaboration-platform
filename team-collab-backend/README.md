# 🚀 Team Collaboration Platform (Mini Trello + Notion Hybrid)

A full-stack team collaboration platform where users can manage projects, tasks, and notes.
Built as part of a full-stack developer screening task to demonstrate real-world backend architecture, authentication, and scalable system design.

---

## 🧱 Tech Stack

### Backend

* NestJS (Node.js framework)
* PostgreSQL (Relational Database)
* Drizzle ORM (Type-safe ORM)

### Authentication

* JWT (JSON Web Token)
* Bcrypt (Password hashing)

---

## ✨ Features

### 🔐 Authentication

* User Signup
* User Login
* JWT-based authentication
* Protected routes using guards
* Secure password hashing with bcrypt

---

### 📁 Projects

* Create a project
* View all projects belonging to the logged-in user
* Delete a project
* User-based authorization (users can only access their own projects)

---

### 📌 Tasks

* Create tasks within a project
* Task fields:

  * Title
  * Description
  * Status (Todo / In Progress / Done)
  * Due Date
* Update task status
* Delete tasks
* Filter tasks by status

---

### 📝 Notes (Planned)

* Add notes to each project
* Full CRUD operations

---

## 🗄️ Database Design

Relational schema using PostgreSQL:

### Tables

* Users
* Projects
* Tasks
* Notes

### Relationships

* User → Projects (1:N)
* Project → Tasks (1:N)
* Project → Notes (1:N)

### Features

* Foreign key constraints
* Cascade delete (maintains data integrity)
* Enum for task status
* Timestamps (createdAt, updatedAt)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/team-collaboration-platform.git
cd team-collaboration-platform
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/team_collab
JWT_SECRET=your_secret_key
```

---

### 4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

---

### 5. Start the development server

```bash
npm run start:dev
```

---

## 🔐 API Endpoints

### Authentication

* `POST /api/auth/signup`
* `POST /api/auth/login`

---

### Projects

* `POST /api/projects` → Create project
* `GET /api/projects` → Get user projects
* `DELETE /api/projects/:id` → Delete project

---

### Tasks

* `POST /api/tasks/:projectId` → Create task
* `GET /api/tasks/:projectId` → Get tasks (optional filter: `?status=todo`)
* `PATCH /api/tasks/:taskId/status` → Update status
* `DELETE /api/tasks/:taskId` → Delete task

---

## 🔒 Security & Authorization

* JWT-based authentication for all protected routes
* Passwords are hashed using bcrypt
* User-level authorization enforced at query level
* Users cannot access or modify other users’ data

---

## 🧠 Key Design Decisions

* Modular architecture using NestJS (Auth, Users, Projects, Tasks)
* Separation of concerns (Controller → Service → Database)
* Drizzle ORM used for type-safe SQL queries
* DTO-based validation using class-validator
* Global validation pipe for request sanitization
* Clean and scalable folder structure

---

## 📈 Future Improvements

* Pagination for tasks (bonus feature)
* Search and advanced filtering
* Drag-and-drop Kanban board
* Notes module implementation
* Frontend (React + Vite)

---

## 📊 Evaluation Focus

This project is designed with emphasis on:

* Clean and maintainable code
* Scalable backend architecture
* Secure authentication and authorization
* Proper database design and relationships
* Real-world API design and error handling

---

## 👨‍💻 Author

Mohammed Nizam
