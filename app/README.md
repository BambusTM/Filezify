# Filezify - Cloud Storage App

A secure cloud storage application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication with NextAuth.js
- File upload and storage
- File listing and management
- Secure file access control
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB 6.x or later
- Yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/filezify.git
   cd filezify
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Generate a secure NEXTAUTH_SECRET
   - Set your JWT_SECRET
   - Configure the upload directory

5. Start the development server:
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── models/               # MongoDB models
└── types/                # TypeScript type definitions
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/files` - File management endpoints
  - GET / - List files
  - POST /upload - Upload a file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
