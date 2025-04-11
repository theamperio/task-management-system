 # Task Management System

 A modern, responsive task management application built with React that helps teams track and manage tasks efficiently. This application allows administrators to create and assign tasks to employees, track task progress, and view comprehensive statistics.

## Live Demo

Check out the live deployed project here:  
👉 **[Live App](https://task-management-system-omega-eight.vercel.app)**

 ## Features

### Protected Routes:
- Role-based route access for Admins and Employees using React Router
- Unauthorized users are redirected to the login page

### Filtering Functionality:
- Admin can filter tasks based on status like New, Active, Completed, and Failed
- Employees can filter their own tasks for better organization

### Fully Responsive Design:
- Built with Tailwind CSS using mobile-first approach
- Optimized for mobile, tablet, and desktop screen sizes


 ### For Administrators:
 - **Dashboard Overview**: View a comprehensive dashboard with task statistics
 - **Employee Management**: Add new employees to the system with secure credentials
 - **Task Creation**: Create and assign tasks to employees with due dates and categories
 - **Task Monitoring**: View all tasks assigned to each employee with their current status
 - **Task Statistics**: See visual breakdown of tasks by status (new, active, completed, failed)

 ### For Employees:
 - **Task Dashboard**: View all assigned tasks in a clean, organized interface
 - **Task Management**: Accept, complete, or reject assigned tasks
 - **Task Filtering**: Filter tasks by status for better organization
 - **Due Date Tracking**: Visual indicators for approaching and overdue tasks

 ## Technologies Used

 - **React**: Frontend library for building user interfaces
 - **React Router**: Navigation and routing for single page application
 - **React Context API**: State management across components
 - **Local Storage**: For persistent data storage
 - **React Hot Toast**: Modern notification system
 - **Tailwind CSS**: Utility-first CSS framework for styling
 - **Lucide React**: Icon library for user interface elements
 - **Vite**: Build tool and development server

 ## Dependencies

 - `react` and `react-dom`: Core React libraries
 - `react-router-dom`: Routing and navigation
 - `react-hot-toast`: Toast notifications
 - `lucide-react`: SVG icon components
 - `tailwindcss`: Utility CSS framework
 - `@vitejs/plugin-react`: Babel integration for Fast Refresh
 - `@vitejs/plugin-react-swc`: SWC integration for Fast Refresh

 ## Getting Started

 To get started with this project, follow these steps:

 1. **Clone the repository:**
     ```bash
     git clone https://github.com/yourusername/task-management-system.git
     cd task-management-system
     ```

 2. **Install dependencies:**
     ```bash
     npm install
     ```

 3. **Run the development server:**
     ```bash
     npm run dev
     ```

 4. **Build for production:**
     ```bash
     npm run build
     ```


## Project Structure

```
/src
  /components   # Reusable components
  /pages        # Page components
  /assets       # Static files
  /styles       # CSS/SCSS files
  /utils        # Utility functions
```


## Key Components

### Authentication
- **Login.jsx**: User authentication with role-based access control
- **ProtectedRoute.jsx**: Route protection based on authentication and roles

### Core Functionality
- **CreateTask.jsx**: Form to create and assign new tasks to employees
- **CreateEmployee.jsx**: Form to add new employees to the system
- **AllTask.jsx**: Dashboard view of all tasks with filtering options
- **TaskList.jsx**: List of tasks with action buttons for employees

### State Management
- **AuthProvider.jsx**: Context for authentication state
- **TaskProvider.jsx**: Context for task-related states and operations

### UI Components
- **Header.jsx**: Application header with user information and logout
- **TaskListNumber.jsx**: Status display showing task counts by category

## Usage Guide

### Admin Login
- Email: admin@gmail.com
- Password: admin123

### Demo Employee Login
- Email: akash@gmail.com
- Password: akash123

## Key Features Implementation

### Modal Dialogs
- Custom modals with focus trapping
- Outside click dismissal
- Keyboard accessibility (Escape key to close)

### Toast Notifications
- Success and error notifications
- Customized styling to match application theme
- Consistent notification system throughout the application

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints for different screen sizes
- Flexible layouts that adapt to various devices

### Authentication
- Role-based access control
- Protected routes
- Persistent authentication using localStorage

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [theamperio](https://github.com/theamperio).

---

Enjoy building with React and Vite in this Admin Dashboard project!