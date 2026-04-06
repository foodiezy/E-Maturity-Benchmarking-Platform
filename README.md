# E-Maturity Benchmarking Suite

A comprehensive, full-stack Next.js web application designed to facilitate organizational e-maturity benchmarking, robust visual analytics, and strict Role-Based Access Control (RBAC). Built for an academic Final Year Project (FYP).

## Features
*   **Dynamic Assessment Engine**: A fully interactive, responsive quiz engine for standard users to evaluate their organization's maturity.
*   **Role-Based Security**: Built-in NextAuth routing locks non-administrative members out of analytics suites.
*   **Consultant Dashboard**: Create, edit, and version complex Maturity Models natively in the browser.
*   **Mathematical Visualizations**: Integrated Recharts dynamically processes assessment responses into visually stunning Radar and Bar gap-analysis graphs.
*   **Personal Isolated Vaults**: Every user has a secure personal dashboard isolated purely to their own dataset.

## Tech Stack
*   **Frontend**: React, Next.js (App Router), Tailwind CSS
*   **Backend**: Next.js Server API Routes, Node.js
*   **Database**: SQLite managed via Prisma ORM
*   **Authentication**: NextAuth.js (bcryptjs encrypted credentials)

---

## How to Run This on Another Computer
If you are downloading this repository onto a completely new laptop, follow these exact steps to run it locally:

### Prerequisites
1. You must have **[Node.js](https://nodejs.org/)** installed on your computer.

### Step-by-Step Installation
1. **Clone or Download the Project**: 
   Click the green "Code" button on GitHub and "Download ZIP" or run `git clone https://github.com/foodiezy/e-maturity-benchmarking-suite.git`.
2. **Open your Terminal**: Navigate inside the extracted project folder using your terminal or Command Prompt.
3. **Install the Dependencies**:
   Run the following command to download all necessary libraries:
   ```bash
   npm install
   ```
4. **Link the Database**:
   Because the database structure needs to be instantiated, run Prisma's push command:
   ```bash
   npx prisma db push
   ```
   *(This safely spins up the local SQLite database inside your folder based on the `schema.prisma` rules).*
5. **Start the Engine!**:
   ```bash
   npm run dev
   ```
6. **Open your Browser**: Go to `http://localhost:3000` to interact with the platform.

### Standard Login Testing
To fully test the platform, navigating to `http://localhost:3000/auth/signup` will allow you to quickly create an account. New accounts possess the standard `USER` role.
