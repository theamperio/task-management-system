const employee = [
    {
        id: 1,
        name: "Akash",
        email: "akash@gmail.com",
        password: "akash123",
        tasks: [
            {
                title: "Complete Project Report",
                description: "Prepare and submit the final project report.",
                date: "2025-02-01",
                category: "Work",
                active: true,
                newTask: false,
                completed: false,
                failed: false
            },
            {
                title: "Update Client Database",
                description: "Ensure all client details are up to date.",
                date: "2025-02-05",
                category: "Data Entry",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            },
            {
                title: "Team Meeting",
                description: "Attend the scheduled team meeting.",
                date: "2025-02-02",
                category: "Meeting",
                active: false,
                newTask: false,
                completed: true,
                failed: false
            },
            {
                title: "Fix Website Bugs",
                description: "Resolve reported website issues.",
                date: "2025-02-07",
                category: "Development",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            },
            {
                title: "Submit Expense Report",
                description: "Send expense report for approval.",
                date: "2025-02-10",
                category: "Finance",
                active: false,
                newTask: false,
                completed: false,
                failed: true
            }
        ]
    },
    {
        id: 2,
        name: "Riya",
        email: "riya@gmail.com",
        password: "riya123",
        tasks: [
            {
                title: "Design UI Mockups",
                description: "Create UI mockups for the new mobile app.",
                date: "2025-02-03",
                category: "Design",
                active: true,
                newTask: false,
                completed: false,
                failed: false
            },
            {
                title: "Write Blog Post",
                description: "Draft a blog post on latest tech trends.",
                date: "2025-02-06",
                category: "Content Writing",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            },
            {
                title: "Client Presentation",
                description: "Prepare slides for client presentation.",
                date: "2025-02-08",
                category: "Presentation",
                active: false,
                newTask: false,
                completed: true,
                failed: false
            },
            {
                title: "Review Codebase",
                description: "Conduct a review of the project codebase.",
                date: "2025-02-09",
                category: "Development",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            },
            {
                title: "Submit Weekly Report",
                description: "Compile and submit the weekly report.",
                date: "2025-02-11",
                category: "Reporting",
                active: false,
                newTask: false,
                completed: false,
                failed: true
            }
        ]
    },
    {
        id: 3,
        name: "John",
        email: "john@gmail.com",
        password: "john123",
        tasks: [
            {
                title: "Complete Project Report",
                description: "Prepare and submit the final project report.",
                date: "2025-02-01",
                category: "Work",
                active: true,
                newTask: false,
                completed: false,
                failed: false
            },
            {
                title: "Update Client Database",
                description: "Ensure all client details are up to date.",
                date: "2025-02-05",
                category: "Data Entry",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            },
            {
                title: "Team Meeting",
                description: "Attend the scheduled team meeting.",
                date: "2025-02-02",
                category: "Meeting",
                active: false,
                newTask: false,
                completed: true,
                failed: false
            }

        ]
    },
    {
        id: 4,
        name: "Sarah",
        email: "sarah@gmail.com",
        password: "sarah123",
        tasks: [
            {
                title: "Design UI Mockups",
                description: "Create UI mockups for the new mobile app.",
                date: "2025-02-03",
                category: "Design",
                active: true,
                newTask: false,
                completed: false,
                failed: false
            },
            {
                title: "Write Blog Post",
                description: "Draft a blog post on latest tech trends.",
                date: "2025-02-06",
                category: "Content Writing",
                active: true,
                newTask: true,
                completed: false,
                failed: false
            }
        ]
    }


];

const admin = {
    id: 1,
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
};

export const setLocalStorage = () => {
    localStorage.setItem("employee", JSON.stringify(employee));
    localStorage.setItem("admin", JSON.stringify(admin));
}
export const getLocalStorage = () => {
    const employee = JSON.parse(localStorage.getItem("employee"));
    const admin = JSON.parse(localStorage.getItem("admin"));
    return { employee, admin };
}
