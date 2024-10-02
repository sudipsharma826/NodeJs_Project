# Content Management System (CMS) Project

This project is a simplified version of a **Content Management System (CMS)** built with **Node.js** and **MySQL**. The system allows users to manage content, perform CRUD operations, and includes features like authentication, authorization, and role-based access control.

## Features

- 🔐 **User Authentication & Authorization**
- 📝 **CRUD Operations** (Create, Read, Update, Delete)
- 📧 **Password Reset via OTP Email**
- 🛡️ **Role-Based Access Control** (Admin & User roles)

## Technologies Used

- **Node.js** - Backend server
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM for MySQL
- **JWT** - Token-based authentication
- **Multer** - File upload
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service for OTP

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sudipsharma826/NodeJs_Project.git
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Set up your `.env` file with the following variables:
    ```
    PORT=3000
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_mysql_database
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. Run the app:
    ```bash
    npm start
    ```

## Live Demo

🔗 **Live Preview**: [Node.js CMS Live](https://www.nodeproject.sudipsharma.com.np/)

## Project Structure

```
/node_modules
/public
/routes
/views
/models
/controllers
/middleware
.env
app.js
```

## System Preview
##🌐 Live Preview: https://www.nodeproject.sudipsharma.com.np/

## Contributions

Feel free to fork this repository, open issues, or submit pull requests. All contributions are welcome!
