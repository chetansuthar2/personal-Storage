# Personal Data Storage App

A Next.js application for storing, managing, and sharing personal files with authentication support.

## Features

- 🔐 **Authentication**: Sign in/Sign up with Clerk or custom authentication
- 📁 **File Management**: Upload, view, download, and share files
- 🖼️ **Multiple File Types**: Support for images, PDFs, videos, and text files
- 🔍 **Search & Filter**: Find files quickly with search and type filtering
- 📊 **Statistics**: View file counts by type
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Get Clerk Keys

1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

The app supports two authentication methods:

### 1. Clerk Authentication (Recommended)
- Click "Sign In with Clerk" or "Sign Up with Clerk" buttons
- Uses Clerk's hosted authentication system
- Secure and feature-rich

### 2. Custom Authentication
- Use the form above the Clerk buttons
- Requires backend API endpoints for `/api/auth/login` and `/api/auth/register`
- Stores user data in localStorage

## File Management

### Supported File Types
- **Images**: JPG, PNG, GIF, etc.
- **PDFs**: PDF documents
- **Videos**: MP4, AVI, MOV, etc.
- **Text**: Plain text files

### Actions Available
- **Upload**: Drag and drop or click to upload
- **View**: Preview file contents
- **Download**: Save files to your device
- **Share**: Share files via native sharing or clipboard
- **Delete**: Remove files from storage

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout with Clerk provider
│   └── page.tsx        # Main page component
├── components/          # React components
│   ├── auth-form.tsx   # Authentication form
│   ├── header.tsx      # Header with auth buttons
│   └── ui/             # UI components
├── lib/                 # Utility libraries
│   ├── auth.ts         # Authentication logic
│   └── storage.ts      # File storage logic
└── styles/             # CSS styles
```

## Technologies Used

- **Next.js 15** - React framework
- **Clerk** - Authentication service
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
