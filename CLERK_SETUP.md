# Clerk Authentication Setup Guide

## Step 1: Create Environment File

Create a file named `.env.local` in your project root directory with the following content:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB (if needed)
MONGODB_URI=your_mongodb_connection_string_here
```

## Step 2: Get Clerk API Keys

1. Go to [clerk.com](https://clerk.com)
2. Sign up or sign in to your account
3. Create a new application
4. Go to the API Keys section
5. Copy your Publishable Key and Secret Key
6. Replace the placeholder values in your `.env.local` file

## Step 3: Restart Your Development Server

After creating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 4: Test Authentication

1. Open your browser and go to `http://localhost:3000`
2. You should now see "Sign In" and "Sign Up" buttons
3. Click on either button to test the authentication flow

## Troubleshooting

- Make sure the `.env.local` file is in the root directory (same level as `package.json`)
- Ensure you've copied the correct API keys from Clerk
- Restart the development server after making changes
- Check the browser console for any error messages

## Note

The `.env.local` file is automatically ignored by Git, so your API keys won't be committed to version control.
