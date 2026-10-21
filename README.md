# Full-Stack Authentication System

A full-stack web application project designed to implement secure user registration, login, session management, and protected access to authenticated resources using React, Node.js, Express, and MySQL.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Objectives](#project-objectives)
- [Planned Features](#planned-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [API Design](#api-design)
- [Database Design](#database-design)
- [Security Considerations](#security-considerations)
- [Testing Strategy](#testing-strategy)
- [Project Status](#project-status)
- [Future Enhancements](#future-enhancements)

## Project Overview

The Full-Stack Authentication System is a web application project focused on implementing the fundamental authentication mechanisms used in modern web applications.

The system is planned to provide a React-based user interface, an Express backend responsible for authentication and authorization, and a MySQL database for persistent user data.

Authentication will use server-side sessions managed through secure cookies. Passwords will be hashed before storage, and protected resources will be accessible only to authenticated users with the required permissions.

This project is being developed incrementally, beginning with project setup and architecture before database integration, API development, and authentication functionality.

## Project Objectives

The primary objectives are to:

1. Establish a maintainable full-stack project structure.
2. Implement user registration with input validation and secure password hashing.
3. Implement login by verifying user credentials.
4. Maintain authenticated sessions across HTTP requests.
5. Restrict access to protected backend resources.
6. Implement logout and session invalidation.
7. Integrate the frontend, backend, and MySQL database.
8. Apply appropriate security, error-handling, and testing practices.
9. Use Git for version control and maintain meaningful development checkpoints.

## Planned Features

### Functional Requirements

| ID | Feature | Description |
|---|---|---|
| FR-01 | User registration | Accept valid user details and create an account. |
| FR-02 | User login | Authenticate users using their registered credentials. |
| FR-03 | Session management | Maintain authenticated state across requests. |
| FR-04 | Authentication status | Allow the frontend to check the current session. |
| FR-05 | Protected resources | Reject unauthenticated requests to protected endpoints. |
| FR-06 | User dashboard | Provide a dashboard for authenticated users. |
| FR-07 | User profile | Retrieve permitted profile information for the current user. |
| FR-08 | Logout | Invalidate the active session and clear the authentication cookie. |
| FR-09 | Error handling | Return appropriate responses for validation failures, invalid credentials, and server errors. |

These features describe the intended behavior and are not yet implemented.

### Non-Functional Requirements

- **Security:** Hash passwords, validate inputs, protect sessions, and use parameterized database queries.
- **Usability:** Provide clear feedback and accessible forms.
- **Reliability:** Handle expected errors without exposing sensitive internal details.
- **Maintainability:** Separate routes, controllers, middleware, services, and configuration.
- **Performance:** Avoid unnecessary database queries and apply appropriate request limits.
- **Testability:** Verify successful operations, invalid input, authentication failures, and access-control behavior.

## Technology Stack

### Frontend

- **React** — component-based user interface.
- **Vite** — frontend development server and build tooling.
- **React Router** — client-side navigation.
- **Axios** — HTTP communication with the backend API.
- **Bootstrap** — responsive layout and styling.

### Backend

- **Node.js** — JavaScript runtime.
- **Express.js** — HTTP server and API framework.
- **mysql2** — MySQL database driver.
- **dotenv** — environment-variable configuration.
- **bcryptjs** — password hashing and verification.
- **express-session** — server-side session management.
- **cors** — cross-origin request configuration.
- **helmet** — security-related HTTP headers.
- **express-rate-limit** — request rate limiting.
- **Nodemon** — automatic backend restart during development.

### Database and Development Tools

- **MySQL** — relational database.
- **Git** — version control.
- **GitHub** — remote repository hosting, when configured.
- **Visual Studio Code** — development environment.

## System Architecture

The planned system follows a three-tier architecture:

1. **Presentation layer:** React renders the user interface and collects user input.
2. **Application layer:** Express validates requests, handles authentication, enforces authorization, and coordinates database operations.
3. **Data layer:** MySQL stores persistent user records and related application data.

The expected request flow is:

`React frontend → Express API → MySQL database`

For authenticated requests, the browser will send the session cookie according to its configured cookie policy. The backend will validate the session before allowing access to protected resources.

The frontend is responsible for presentation and navigation. The backend remains responsible for authentication and authorization decisions.

## Project Structure

The planned project structure is:

```text
authentication-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── session.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   └── requireAuth.js
│   │   ├── services/
│   │   │   └── auth.service.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

The structure above represents the intended final organization. Some files and folders will be added as development progresses.

## Prerequisites

Install the following tools before running the complete application:

- Node.js and npm
- MySQL Server and a MySQL client
- Git
- Visual Studio Code

Verify the installations:

```bash
node -v
npm -v
git --version
mysql --version
```

The MySQL command may not be available in your terminal if the MySQL client is not on your system PATH.

## Installation and Setup

### 1. Clone the repository

After the project has been published to GitHub, clone it using the repository URL:

```bash
git clone <YOUR_REPOSITORY_URL>
cd authentication-system
```

Alternatively, open the existing local project directory if you have already created it.

### 2. Install frontend dependencies

```bash
cd client
npm install
```

If the frontend dependencies have not yet been installed, install the additional packages:

```bash
npm install react-router axios bootstrap
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

For a fresh backend setup where dependencies have not yet been installed:

```bash
npm install express mysql2 dotenv cors express-session bcryptjs helmet express-rate-limit
npm install --save-dev nodemon
```

### 4. Configure environment variables

Create a local `server/.env` file using the configuration described in the Environment Configuration section.

### 5. Prepare the database

Create the MySQL database and apply the database schema after the database scripts have been implemented.

### 6. Start the application

Start the frontend from the `client` directory:

```bash
npm run dev
```

Start the backend in a separate terminal from the `server` directory:

```bash
npm run dev
```

These commands assume that the relevant npm scripts and backend entry point have been created. During the initial setup stage, the frontend can run independently, while the backend requires its server entry file before it can start.

## Environment Configuration

The backend will use environment variables for local configuration.

Example `server/.env.example`:

```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system

SESSION_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Create `server/.env` with the actual values for your local environment.

**Never commit real credentials or session secrets to version control.** The `.env` file must be excluded by `.gitignore`; `.env.example` should contain placeholders only.

Frontend environment variables prefixed with `VITE_` are exposed to browser-side code and must never contain database credentials, session secrets, or other private backend values.

## Development Workflow

Development will proceed in stages:

1. Complete the project structure and dependency setup.
2. Configure MySQL and create the initial schema.
3. Create and test the Express server.
4. Establish and verify the database connection.
5. Implement registration and password hashing.
6. Implement login and session creation.
7. Add authentication-status and protected-resource endpoints.
8. Integrate the React frontend with the API.
9. Implement logout and session invalidation.
10. Test validation, authentication, authorization, and error handling.
11. Review security configuration and prepare deployment documentation.

Git checkpoints will be created after meaningful development stages.

## API Design

The following endpoints are planned for the initial authentication API:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user. |
| POST | `/api/auth/login` | Authenticate a user and establish a session. |
| GET | `/api/auth/me` | Return the current authenticated user's status and permitted information. |
| POST | `/api/auth/logout` | Invalidate the current session. |
| GET | `/api/profile` | Retrieve the current user's protected profile. |

The HTTP methods, request formats, response structures, validation rules, and error codes will be defined during API implementation. These endpoints are planned and are not yet available.

## Database Design

The initial database design is expected to include a `users` table with fields such as:

| Field | Purpose |
|---|---|
| `user_id` | Unique user identifier and primary key. |
| `name` | User's display name. |
| `email` | Unique account email address. |
| `password_hash` | Password hash; never store the original password. |
| `created_at` | Account creation timestamp. |

The database schema will define the appropriate data types, constraints, and indexes.

Session storage will be configured separately. A production deployment must use an appropriate persistent session store rather than Express's default in-memory session store.

## Security Considerations

The implementation will follow these principles:

- Store password hashes rather than plaintext passwords.
- Use parameterized SQL queries to mitigate SQL injection.
- Validate and normalize input on the backend.
- Enforce authorization on protected API endpoints.
- Configure session cookies with `HttpOnly`, `Secure` in HTTPS production, and an appropriate `SameSite` policy.
- Use a strong, private session secret.
- Configure CORS for the intended frontend origin.
- Apply rate limits to sensitive endpoints, particularly login and registration.
- Consider CSRF protection based on the session-cookie and deployment design.
- Avoid returning password hashes, session secrets, or sensitive internal errors to clients.
- Use HTTPS in production and keep dependencies updated.

Security middleware and packages alone do not guarantee a secure application; they must be configured and tested correctly.

## Testing Strategy

Testing will cover:

- Successful and unsuccessful registration.
- Duplicate email addresses and invalid input.
- Correct and incorrect login credentials.
- Session persistence across requests.
- Access to protected endpoints with and without authentication.
- Successful logout and rejection of the invalidated session.
- Database errors and unexpected server failures.
- Cookie behavior, CORS configuration, and request limits.

Manual API testing and automated tests will be introduced as the corresponding features are implemented.

## Project Status

**Current stage:** Initial project setup.

The frontend and backend project structures and dependencies are being prepared. Database integration, API implementation, and authentication behavior remain planned development tasks until they have been implemented and tested.

## Future Enhancements

Potential extensions after the core authentication flow is complete include:

- Email verification.
- Password reset.
- Role-based authorization.
- Improved account and session management.
- Automated integration and security testing.
- Production deployment and monitoring.

---

**Development note:** This README describes the intended architecture and implementation plan. Update the project status, installation instructions, API documentation, and feature descriptions as the system evolves.