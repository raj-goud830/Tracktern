# Opportunity Tracker (Tracktern)

**Opportunity Tracker** is a full-stack, centralized web application designed to help students, fresh graduates, and job seekers effectively track, manage, and optimize their job, internship, hackathon, and scholarship applications. 

By replacing scattered spreadsheets and disorganized notes, this application helps you never miss a deadline, keep track of application statuses, and stay organized throughout your career search.

## 🚀 Key Features

*   **Application Management Dashboard:** Track all your applications in one unified space. Monitor statuses (Applied, Interview, Accepted, Rejected) and log specific roles and companies.
*   **Kanban Board (Upcoming):** A visual, drag-and-drop Trello-style board to seamlessly move applications across different stages of the hiring pipeline.
*   **Resume Hub (Upcoming):** Securely upload, store, and manage multiple versions of your resume tailored for different roles.
*   **Secure User Authentication:** Complete authentication flow, protected routes, and session management powered by Clerk.
*   **Performance & Type Safety:** Built from the ground up for speed and strict type-safety across the entire stack using Next.js, tRPC, and Prisma.

## 🛠️ Tech Stack

*   **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Backend / API:** [tRPC](https://trpc.io/) for end-to-end type-safe APIs
*   **Database:** [Neon (Serverless Postgres)](https://neon.tech/) & [Prisma ORM](https://www.prisma.io/)
*   **Authentication:** [Clerk](https://clerk.com/)

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tracktern.git
    cd Tracktern
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    # Database
    DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require&channel_binding=require"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
    ```

4.  **Sync the Database:**
    ```bash
    npx prisma db push
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/tracktern/issues).
