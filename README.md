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


# HostMeetings API Documentation

This API manages host meetings. It allows creating, reading, updating, and deleting meeting records in the system.

## Base URL:
`<your_base_url>/api`

## Endpoints:

### 1. Create a Host Meeting
**POST** `/hostmeetings`

#### Request Body:
```json
{
  "host_id": 1,
  "meeting_date": "2024-12-15",
  "time_slots": [
    { "start_time": "09:00", "end_time": "10:00","book_id": "0" },
    { "start_time": "14:00", "end_time": "15:00", "book_id": "1" } // book id is the registered database id where the user registers this time
  ],
  "recurring": false
}
```

#### Response:
**Status Code: 201 Created**
```json
{
  "message": "Host meeting created successfully!",
  "meetingId": 1
}
```

**Error Response:**  
**Status Code: 500 Internal Server Error**
```json
{
  "message": "Error message"
}
```

---

### 2. Get Host Meetings by Host ID
**GET** `/hostmeetings/host/:hostId`

#### URL Parameters:
- `hostId` (integer): ID of the host.

#### Response:
**Status Code: 200 OK**
```json
{
    "id": 1,
    "host_id": 1,
    "meeting_date": "2024-12-14T18:00:00.000Z",
    "time_slots": "[{"start_time":"09:00","end_time":"10:00"},{"start_time":"14:00","end_time":"15:00"}]",
    "recurring": 0,
    "created_at": "2024-12-08T17:34:19.000Z",
    "updated_at": "2024-12-08T17:34:19.000Z"
}
```

**Error Responses:**  
**Status Code: 404 Not Found**
```json
{
  "message": "No meetings found for this host."
}
```
**Status Code: 500 Internal Server Error**
```json
{
  "message": "Error message"
}
```

---

### 3. Get Host Meeting by ID
**GET** `/hostmeetings/:meetingId`

#### URL Parameters:
- `meetingId` (integer): ID of the meeting.

#### Response:
**Status Code: 200 OK**
```json
{
    "id": 1,
    "host_id": 1,
    "meeting_date": "2024-12-14T18:00:00.000Z",
    "time_slots": "[{"start_time":"09:00","end_time":"10:00"},{"start_time":"14:00","end_time":"15:00"}]",
    "recurring": 0,
    "created_at": "2024-12-08T17:34:19.000Z",
    "updated_at": "2024-12-08T17:34:19.000Z"
}
```

**Error Responses:**  
**Status Code: 404 Not Found**
```json
{
  "message": "Meeting not found."
}
```
**Status Code: 500 Internal Server Error**
```json
{
  "message": "Error message"
}
```

---

### 4. Update a Host Meeting
**PUT** `/hostmeetings/:meetingId`

#### URL Parameters:
- `meetingId` (integer): ID of the meeting.

#### Request Body:
```json
{
  "meeting_date": "2024-12-16",
  "time_slots": ["10:00-11:00", "15:00-16:00"]
}
```

#### Response:
**Status Code: 200 OK**
```json
{
  "message": "Meeting updated successfully!",
  "updatedMeetingId": 1
}
```

**Error Responses:**  
**Status Code: 404 Not Found**
```json
{
  "message": "Meeting not found."
}
```
**Status Code: 400 Bad Request**
```json
{
  "message": "Failed to update meeting."
}
```
**Status Code: 500 Internal Server Error**
```json
{
  "message": "Error message"
}
```

---

### 5. Delete a Host Meeting
**DELETE** `/hostmeetings/:meetingId`

#### URL Parameters:
- `meetingId` (integer): ID of the meeting.

#### Response:
**Status Code: 200 OK**
```json
{
  "message": "Meeting deleted successfully!",
  "deletedMeetingId": 1
}
```

**Error Responses:**  
**Status Code: 404 Not Found**
```json
{
  "message": "Meeting not found."
}
```
**Status Code: 400 Bad Request**
```json
{
  "message": "Failed to delete meeting."
}
```
**Status Code: 500 Internal Server Error**
```json
{
  "message": "Error message"
}
```

---

## Notes:
- **Time Slots Format:** Time slots are expected as an array of strings, e.g., `["09:00-10:00", "14:00-15:00"]`.
- **Timestamps:** All dates are in ISO 8601 format.
- Ensure proper error handling to manage invalid inputs or server issues.

Here's the content of the API documentation in Markdown format:

markdown
Copy code
# API Documentation: Guest Registrations

This document provides the API documentation for managing guest registrations for host meetings.

## Base URL

http://<your-server-address>/api

yaml
Copy code

---

## Endpoints

### 1. Create Guest Registration
**POST /guestregistrations**

**Description**: Create a new guest registration for a specific meeting.

**Request Body**:

```json
{
  "meeting_id": 1,
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com",
  "message": "Looking forward to the meeting!"
}
Responses:

201 Created:
json
Copy code
{
  "message": "Guest registration created successfully!",
  "registrationId": 1
}
500 Internal Server Error:
json
Copy code
{
  "message": "Error creating guest registration: <error_message>"
}
2. Get Registrations by Meeting ID
GET /guestregistrations/meeting/:meetingId

Description: Retrieve all guest registrations for a specific meeting.

Path Parameter:

meetingId: The ID of the host meeting.
Responses:

200 OK:
json
Copy code
[
  {
    "id": 1,
    "meeting_id": 1,
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "message": "Looking forward to the meeting!",
    "created_at": "2024-12-09T12:00:00.000Z",
    "updated_at": "2024-12-09T12:00:00.000Z"
  }
]
404 Not Found:
json
Copy code
{
  "message": "No registrations found for this meeting."
}
500 Internal Server Error:
json
Copy code
{
  "message": "Error fetching registrations: <error_message>"
}
3. Delete Guest Registration
DELETE /guestregistrations/:registrationId

Description: Delete a guest registration by its ID.

Path Parameter:

registrationId: The ID of the guest registration to delete.
Responses:

200 OK:
json
Copy code
{
  "message": "Guest registration deleted successfully."
}
404 Not Found:
json
Copy code
{
  "message": "Guest registration not found."
}
500 Internal Server Error:
json
Copy code
{
  "message": "Error deleting registration: <error_message>"
}