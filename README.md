# ✍️ Signature Server API

This is the backend Node.js & Express server for the Digital Signature App. It handles:

- 📄 PDF upload and storage
- ✍️ Signature positioning and styling
- 🔐 JWT-based authentication
- 📬 Email sharing
- 📊 Audit trail logging
- 🧾 Finalizing signed documents

---

## 🚀 Tech Stack

- **Node.js** with **Express**
- **MongoDB** (Mongoose)
- **PDF-lib** for PDF editing
- **JWT** for auth
- **Nodemailer** for emails
- **Multer** for file uploads

---

## 📦 Installation

```bash
git clone https://github.com/krishnaT07/signature-server.git
cd signature-server
npm install
🔐 Environment Variables
Create a .env file in the root with the following:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
BASE_URL=http://localhost:5000
✅ For Gmail, enable "App Passwords" or "Less Secure Apps".

▶️ Run the Server
bash
Copy
Edit
npm run dev
The server will start at http://localhost:5000
📁 Folder Structure
cpp
Copy
Edit
signature-server/
├── controllers/
├── models/
├── routes/
├── uploads/         ← PDF upload folder
├── signed/          ← Finalized signed PDFs
├── utils/
├── .env
└── server.js
📡 API Endpoints
Auth
POST /api/auth/register – Register a new user

POST /api/auth/login – Login and receive JWT

Documents
POST /api/docs/upload – Upload a new PDF

GET /api/docs/ – Get all documents

GET /api/docs/:id – Get a document by ID

DELETE /api/docs/:id – Delete a document

Signatures
POST /api/signatures/ – Save signature data

POST /api/signatures/finalize – Finalize and embed signature(s) in PDF

GET /api/signatures/:docId – Get audit trail for a document

Sharing
GET /api/shared/:token – Validate shared token link

POST /api/shared/finalize/:token – Finalize signature from shared link

📬 Email Sharing (Optional)
To enable sharing via email, configure:

env
Copy
Edit
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Uses Nodemailer.

🧪 Testing (Coming Soon)
Unit and integration tests using Jest or Supertest.
