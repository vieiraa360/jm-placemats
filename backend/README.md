# JM Placemats Backend API

Node.js backend with MongoDB and email relay for JM Placemats website.

## Features

- ✅ RESTful API for contact form submissions
- ✅ MongoDB database for storing inquiries
- ✅ Email relay using Nodemailer
- ✅ Input validation
- ✅ CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- **MongoDB**: Set `MONGODB_URI` (local or MongoDB Atlas)
- **Email**: Configure SMTP settings (Gmail, SendGrid, etc.)
- **Port**: Set `PORT` (default: 3000)
- **Frontend URL**: Set `FRONTEND_URL` (default: http://localhost:3001)

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Default connection: `mongodb://localhost:27017/jm-placemats`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `MONGODB_URI` in `.env`

### 4. Email Configuration

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASS`

**For other providers:**
- Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE` accordingly
- Common providers:
  - SendGrid: `smtp.sendgrid.net`, port 587
  - Mailgun: `smtp.mailgun.org`, port 587
  - Outlook: `smtp-mail.outlook.com`, port 587

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## API Endpoints

### POST /api/contact
Submit a contact inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in custom placemats..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact inquiry submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/contact
Get all contact inquiries (for admin use).

**Query Parameters:**
- `status`: Filter by status (new, read, replied)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/jm-placemats |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_SECURE` | Use TLS | false |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASS` | SMTP password | - |
| `EMAIL_FROM` | Sender email | - |
| `EMAIL_TO` | Recipient email | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3001 |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── email.js          # Email configuration
│   ├── controllers/
│   │   └── contactController.js  # Contact logic
│   ├── models/
│   │   └── ContactInquiry.js     # MongoDB schema
│   ├── routes/
│   │   └── contactRoutes.js      # API routes
│   └── server.js                  # Main server file
├── .env.example                   # Environment template
├── .gitignore
├── package.json
└── README.md
```

