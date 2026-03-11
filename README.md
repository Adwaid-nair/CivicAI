# CivicAI

CivicAI is an AI-powered platform for civic reporting and issue tracking.

## How to Run the Application Manually

To run everything manually, you will need to start both the backend and frontend development servers in separate terminal windows.

### 1. Start the Backend Server

Open a new terminal window and run the following commands:
```powershell
# Navigate to the backend directory
cd backend

# Install dependencies (only needed if you haven't recently or added new packages)
npm install

# Start the development server (runs with nodemon so it auto-restarts on changes)
npm run dev
```

### 2. Start the Frontend Server

Open a second, separate terminal window and run the following commands:
```powershell
# Navigate to the frontend directory
cd frontend

# Install dependencies (only needed if you haven't recently or added new packages)
npm install

# Start the Next.js development server
npm run dev
```

### Additional Commands (If Required)

If you have recently made any changes to your database schema (`backend/prisma/schema.prisma`), you may also need to run these commands in the **backend** directory before starting the backend server:

```powershell
# Update the Prisma client
npx prisma generate

# Push changes to the database
npx prisma db push
```

Once both servers are running:
* Your backend will be accessible on its configured port (as defined in your `.env` file, e.g., `http://localhost:5000`).
* Your frontend will be available at `http://localhost:3000`.

### Troubleshooting: ngrok Connection Error (ERR_NGROK_8012)

If you are using `ngrok` to expose your local Next.js frontend to the internet and encounter an `ERR_NGROK_8012` error (dial tcp [::1]:3000: connectex: No connection could be made because the target machine actively refused it), the issue is that Next.js might be listening on IPv4, while ngrok is attempting an IPv6 connection.

To fix this, explicitly force ngrok to use IPv4 with the following command:

```powershell
ngrok http http://127.0.0.1:3000
```
