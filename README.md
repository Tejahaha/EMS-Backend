# EMS Backend

This is the backend for the Employee Management System (EMS). It handles authentication, user management, attendance tracking, leave management, and payroll processing.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ems-backend
```

### 2. Create a `.env` File

You need to create a `.env` file in the root of the project and add the following environment variables:

```
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_uri
INVITE_LINK=your_secret_invite_link
```

- `JWT_SECRET`: Secret key used for JSON Web Token authentication.
- `MONGODB_URI`: Connection string for MongoDB.
- `INVITE_LINK`: A private invite link that allows the admin to log in securely.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

---

## API Overview

The backend provides several functionalities for EMS, organized into different modules:

### **Auth**
- **POST /signup** → Register a new user.
- **POST /login** → Authenticate users and return a JWT.

### **User CRUD**
- **PUT /update-user** → Update user details.
- **GET /get-users** → Retrieve all users.
- **DELETE /delete-users** → Remove users from the system.

### **Attendance**
- **GET /get-all-attendance** → Fetch attendance records.
- **POST /post-attendance** → Submit new attendance data.

### **Leave**
- **POST /post-leave** → Apply for leave.
- **GET /get-applications** → Fetch all leave applications.
- **PUT /status** → Update leave application status.

### **Payroll**
- **GET /fetch-emp** → Retrieve employee payroll data.
- **PUT /set-payroll** → Set payroll details for employees.
- **POST /process-payroll** → Process payroll for employees.
- **GET /get-payslips** → Retrieve payslips.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)

---

## Contributing

Feel free to fork the repository and make improvements! Create a pull request with detailed changes.

---

## License

This project is licensed under the MIT License.

