# Backend - StockWiseCare

## 🧠 Problem Statement
The backend powers the StockWiseCare platform by serving real-time portfolio data, managing charity donations, providing AI-based stock insights, handling file uploads, and supporting chatbot interactions—all through secure APIs.

## ✅ Proposed Solution
A robust and secure backend using Express.js and MongoDB that serves financial data, supports user interactions, and integrates AI and file services for enhanced user experience.

## 💻 Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)

## 🧩 Supporting Libraries
- `bcrypt` – for password hashing
- `crypto` – secure tokens
- `nodemailer` – email support
- `express-fileupload` – file handling
- `cloudinary` – image uploads and hosting
- `node-cron` – scheduled tasks
- `helmet` – HTTP security headers
- `morgan` – logging
- `cors` – cross-origin requests
- `pdfkit` or similar – PDF report generation

## 🚀 Core Features
- **Portfolio APIs**: Real-time data on stocks, value, and performance.
- **Charity Donations**: Donation records and total contribution tracking.
- **Market Insights**: Sentiment and trend analysis using AI.
- **Chatbot API**: AI-powered responses to financial queries.

## ✨ Additional Features
- **PDF Generation**: Export user portfolio summaries or donation receipts.
- **File Uploads**: Support for uploading user-related documents/images.
- **Cloudinary Integration**: Image hosting and delivery.
- **CORS Configured**: For frontend-backend communication.
- **Scheduled Jobs**: Background tasks (e.g., analytics refresh).

## 🔧 Implementation
- Modular routing structure using Express.
- Mongoose schemas for users, portfolios, and donations.
- RESTful endpoints:
  - `/api/portfolio`
  - `/api/charity`
  - `/api/insights`
  - `/api/chatbot`
  - `/api/upload`
  - `/api/pdf`

## 🌐 Deployment
- Live on [Render](https://render.com)  
  🔗 [Backend Link](https://stockwisecare-backend.onrender.com)

## 🔗 Integration with Frontend
- Frontend communicates via Axios to fetch data and interact with backend services.
- Chatbot, portfolio, and insights are all rendered using backend APIs.

## ⚠️ Notes
- Frontend and backend are connected and functioning.
- Future scope includes:
  - Secure user authentication and authorization
  - Enhanced chatbot intelligence
  - Input validation and testing
  - API documentation

## 📬 Contact
- **LinkedIn**: [Sri Poojitha Jorige](https://www.linkedin.com/in/sri-poojitha-jorige-377270294)
- **Team Members linkdin**: [Cherisma](www.linkedin.com/in/cherisma-anamala-muni), [Shivathmika](https://www.linkedin.com/in/shivathmikavelishala)
- **Email**: sripoojitha.2006@gmail.com
