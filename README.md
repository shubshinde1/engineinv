# Invezza HRMS Portal

## Overview

The **Invezza HRMS Portal** is a comprehensive Human Resource Management System designed to streamline HR processes, manage employee data, and facilitate communication within an organization. This portal includes features such as employee management, attendance tracking, leave management, project management, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Employee Management**: Add, update, and delete employee details.
- **Attendance Tracking**: Mark attendance and view attendance records.
- **Leave Management**: Apply for leave, approve/reject leave applications, and view leave balances.
- **Project Management**: Add, update, and delete projects, and assign employees to projects.
- **Role and Permission Management**: Manage user roles and permissions.
- **Email Notifications**: Send email notifications for various actions such as password reset, leave application status, etc.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/invezza-hrms-portal.git
   ```

   ```sh
   cd invezza-hrms-portal
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

## Configuration

- **Database**: The application uses MongoDB as its database. Configure the connection string in the `.env` file.
- **Email**: The application uses Nodemailer for sending emails. Configure the SMTP settings in the `.env` file.
- **Cloudinary**: The application uses Cloudinary for file uploads. Configure the Cloudinary settings in the `.env` file.

## Usage

- **Admin Routes**: Accessible only by admin users. Used for managing roles, permissions, clients, projects, and settings.
- **Common Routes**: Accessible by all authenticated users. Used for managing timesheets, attendance, leave applications, and profiles.
- **Auth Routes**: Used for user authentication, registration, and profile management.

## API Endpoints

### Admin Routes

#### Roles

- **POST** `/api/admin/storerole` - Add a new role.
- **GET** `/api/admin/getroles` - Get all roles.

#### Clients

- **POST** `/api/admin/addclient` - Add a new client.
- **POST** `/api/admin/updateclient` - Update a client.
- **GET** `/api/admin/viewclient` - View all clients.
- **POST** `/api/admin/viewclientbyid` - View a client by ID.
- **POST** `/api/admin/softdeleteclient` - Soft delete a client.

#### Projects

- **POST** `/api/admin/addproject` - Add a new project.
- **POST** `/api/admin/updateproject` - Update a project.
- **GET** `/api/admin/viewproject` - View all projects.
- **POST** `/api/admin/viewprojectbyid` - View a project by ID.
- **POST** `/api/admin/deleteproject` - Delete a project.
- **POST** `/api/admin/softdeleteproject` - Soft delete a project.

#### Leave Management

- **POST** `/api/admin/addleaves` - Add leaves.
- **POST** `/api/admin/addholidays` - Add holidays.
- **POST** `/api/admin/deleteholidays` - Delete holidays.
- **POST** `/api/admin/updateleavebalancefornewemployee` - Update leave balance for a new employee.
- **POST** `/api/admin/viewholidays` - View holidays.
- **POST** `/api/admin/approveLeave` - Approve leave.

#### Settings

- **POST** `/api/admin/updatetimesheetlimit` - Update timesheet limit.
- **GET** `/api/admin/gettimesheetlimit` - Get timesheet limit.
- **POST** `/api/admin/adddepartment` - Add a department.
- **GET** `/api/admin/getdepartment` - Get departments.
- **POST** `/api/admin/deletedepartment` - Delete a department.
- **POST** `/api/admin/addcountry` - Add a country.
- **GET** `/api/admin/getcountry` - Get countries.
- **POST** `/api/admin/deletecountry` - Delete a country.
- **POST** `/api/admin/addreportingto` - Add reporting to.
- **GET** `/api/admin/getreportingto` - Get reporting to.
- **POST** `/api/admin/deletereportingto` - Delete reporting to.
- **POST** `/api/admin/adddesignation` - Add a designation.
- **GET** `/api/admin/getdesignation` - Get designations.
- **POST** `/api/admin/deletedesignation` - Delete a designation.
- **GET** `/api/admin/getallsettings` - Get all settings.

### Common Routes

#### Timesheets

- **POST** `/api/filltimesheet` - Fill a timesheet.
- **POST** `/api/gettimesheetbydate` - Get timesheet by date.
- **POST** `/api/gettimesheetdays` - Get timesheet days.
- **POST** `/api/gettimesheetdurations` - Get yearly durations.
- **GET** `/api/getprojectdetails` - Get project details.
- **POST** `/api/viewtimesheet` - View timesheet.
- **POST** `/api/deletetimesheet` - Delete timesheet.
- **POST** `/api/updatetimesheet` - Update timesheet.

#### Profiles

- **POST** `/api/uploadprofile` - Upload profile picture.
- **POST** `/api/deleteprofile` - Delete profile picture.
- **POST** `/api/updateprofile` - Update profile picture.
- **POST** `/api/viewprofile` - View profile picture.

#### Leave Applications

- **POST** `/api/leaveapplication` - Apply for leave.
- **POST** `/api/leaveapplicationhistory` - View leave application history.
- **GET** `/api/allleaveapplications` - View all leave applications.
- **POST** `/api/deleteleaveapplication` - Delete leave application.
- **POST** `/api/getoptionalholidaylist` - Get optional holiday list.

### Auth Routes

- **POST** `/api/register` - Register a new user.
- **POST** `/api/login` - Login a user.
- **POST** `/api/forgotpassword` - Forgot password.
- **POST** `/api/employeedetails` - Add employee details.
- **GET** `/api/profile` - Get user profile.
- **GET** `/api/resetpassword` - Reset password.
- **POST** `/api/resetpassword` - Update password.
