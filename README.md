# Storage

A full-stack web application for storing and managing files.

## Features

*   User authentication (Login, Register) using Clerk.
*   Upload, view, and manage files.
*   Search for files.
*   User profiles.
*   API for managing files and users.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **UI:** [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

*   [Node.js](https://nodejs.org/en) (v18.x or later)
*   [pnpm](https://pnpm.io/installation)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd storage
    ```
3.  Install the dependencies:
    ```bash
    pnpm install
    ```
4.  Set up your environment variables. Create a `.env.local` file by copying the `env-template.txt` file and fill in the required values.
    ```bash
    cp env-template.txt .env.local
    ```

### Running the Application

To start the development server, run the following command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                # Next.js App Router pages and API routes
├── components/         # React components
├── hooks/              # Custom React hooks
├── lib/                # Helper functions, database connection, etc.
├── public/             # Static assets
├── scripts/            # Scripts
└── styles/             # Global styles
```