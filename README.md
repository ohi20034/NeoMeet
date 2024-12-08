# NeoMeet
Backend auth

# User Management API Documentation

## Overview
The User Management API provides endpoints for user registration, authentication, and retrieval. It uses JWT for securing routes and MySQL for database management.

## Base URL
```
http://<server-host>:<port>/api
```

## Endpoints

### 1. **User Registration**
#### **POST** `/users`
Creates a new user in the system.

#### Request Body:
```json
{
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "timezone": "string",
  "organization_name": "string"
}
```

#### Response:
- **201 Created:**
```json
{
  "message": "User created successfully!",
  "userId": "integer"
}
```
- **500 Internal Server Error:**
```json
{
  "message": "string"
}
```

### 2. **Get User by Email**
#### **GET** `/users/email/:email`
Retrieves user details by email.

#### Path Parameters:
- `email` (string): The email of the user to retrieve.

#### Response:
- **200 OK:**
```json
{
  "user_id": "integer",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "timezone": "string",
  "organization_name": "string",
  "created_at": "string"
}
```
- **404 Not Found:**
```json
{
  "message": "User not found"
}
```
- **500 Internal Server Error:**
```json
{
  "message": "string"
}
```

### 3. **Get User by ID**
#### **GET** `/users/:userId`
Retrieves user details by ID.

#### Path Parameters:
- `userId` (integer): The ID of the user to retrieve.

#### Response:
- **200 OK:**
```json
{
  "user_id": "integer",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "timezone": "string",
  "organization_name": "string",
  "created_at": "string"
}
```
- **404 Not Found:**
```json
{
  "message": "User not found"
}
```
- **500 Internal Server Error:**
```json
{
  "message": "string"
}
```

### 4. **User Login**
#### **POST** `/login`
Authenticates a user and returns a JWT.

#### Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response:
- **200 OK:**
```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "userId": "integer",
    "name": "string",
    "email": "string",
    "timezone": "string",
    "organizationName": "string"
  }
}
```
- **400 Bad Request:**
```json
{
  "message": "Invalid email or password."
}
```

### 5. **Protected Route Example**
#### **GET** `/protected`
An example of a protected route that requires a valid JWT token.

#### Request Headers:
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response:
- **200 OK:**
```json
{
  "message": "This is a protected route",
  "user": {
    "userId": "integer",
    "email": "string",
  }
}
```
- **401 Unauthorized:**
```json
{
  "message": "Authentication required"
}
```
- **403 Forbidden:**
```json
{
  "message": "Invalid or expired token"
}
```

## Models

### User Table Schema
- `user_id` (integer, auto-increment, primary key)
- `name` (string, required)
- `email` (string, unique, required)
- `password_hash` (string, required)
- `timezone` (string, required)
- `organization_name` (string, optional)
- `created_at` (timestamp, default: current timestamp)

## Error Codes
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Authorization
All protected routes require a valid JWT token in the `Authorization` header using the format:
```
Bearer <token>
```

## Environment Variables
Ensure the following environment variables are set:
- `PORT`: The port the server listens on (default: 3000).
- `DB_HOST`: The database host.
- `DB_USER`: The database username.
- `DB_PASSWORD`: The database password.
- `DB_NAME`: The database name.
- `JWT_SECRET_KEY`: The secret key for JWT signing.


