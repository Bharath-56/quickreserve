🚄 QuickReserve - Train Ticket Booking Web App
QuickReserve is a full-stack train ticket booking system developed by a team of two. 
It offers a seamless experience for users to register, verify their email, search for trains using smart autocomplete, book/cancel tickets, and view bookings. Admins can manage trains and users from a dedicated dashboard.

💡 Features**
🔐 User Authentication (Login, Register, Sessions)
✉️ Email Verification using Nodemailer
🔍 Train Search with autocomplete suggestions
🎟️ Train Booking & Cancellation
📬 Email Notifications for confirmed bookings
🛠 Admin Panel to add/delete trains and manage users
📊 Responsive UI with HTML, CSS (Flexbox), and JavaScript
🚀 Deployed on Render with PostgreSQL

⚙️ Tech Stack**
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: PostgreSQL
Deployment: Render
Email Service: Nodemailer (Gmail SMTP)

📁 Folder Structure**
├── public/              # Frontend HTML, CSS, JS
├── routes/              # Express route handlers (auth, user, admin)
├── models/              # Database models
├── controllers/         # Logic for routes
├── server.js            # Main Express server file
├── db.js                # PostgreSQL connection setup
├── .env                 # Environment variables

🚀 Getting Started**

1. Clone the repository*
git clone https://github.com/Bharath-56/quickreserve.git
cd quickreserve

3. Install dependencies*
npm install

3. Configure Environment*
Create a .env file with your credentials:

DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=5432
SESSION_SECRET=yourSecretKey
EMAIL_USER=@gmail.com
EMAIL_PASS=yourAppPassword

4. Start the server*
node server.js

👨‍💻 Developed By
Bharath S M
M Manjunath








