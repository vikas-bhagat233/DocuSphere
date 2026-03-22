# DocuSphere

DocuSphere is a premium document sharing and portfolio platform. It allows users to upload documents, manage them in a secure vault, and share them via public portfolios or direct links. Users can discover their friends' portfolios with an intelligent live-search interface.

---

## 🌟 Features

- **Document Vault:** Securely upload, store, and manage your files.
- **Public Portfolios:** Showcase selected documents on a personalized, shareable public profile.
- **Live Search Autocomplete:** Instantly search for friends, creators, or documents with real-time feedback and recent searches.
- **Glassmorphism UI:** A sleek, premium, responsive UI featuring smooth micro-animations and intuitive navigation.
- **Dark/Light Themes:** Easily toggle between custom themes.
- **Trash/Bin Recovery:** Safely recover deleted documents.

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Vanilla CSS (Premium Glassmorphism), Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, AWS S3 (for file storage)

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/DocuSphere.git
   cd DocuSphere
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_BUCKET=your_aws_s3_bucket_name
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm start
   ```

---

## 🚀 Deployment Guide (Zero Errors)

If you want to host DocuSphere so that anyone can use it on the internet, follow these exact steps:

### Part 1: Deploy Backend to Render (Free)
1. Push your entire project to a **GitHub** repository.
2. Go to [Render](https://render.com) and log in.
3. Click **New +** and select **Web Service**.
4. Connect your GitHub account and select your `DocuSphere` repository.
5. Setup the service with the following settings:
   - **Name:** `docusphere-backend` (or similar)
   - **Root Directory:** `backend` (Super important! DO NOT leave blank)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Scroll down to **Environment Variables** and add all the variables from your local `.env` file (`MONGO_URI`, `JWT_SECRET`, `AWS_BUCKET`, etc.).
7. Click **Create Web Service**. 
8. Wait for the deployment to finish, and copy your live backend URL (e.g., `https://docusphere-backend.onrender.com`).

---

### Part 2: Update Frontend API URL
Before deploying the frontend, you need to tell it to talk to the live backend instead of localhost.
1. In your code editor, open `frontend/src/services/documentService.js` (and any other files hitting the API).
2. Change the API URL from:
   ```javascript
   const API = "http://localhost:5000/api/documents";
   ```
   To your new Render URL:
   ```javascript
   const API = "https://your-render-url.onrender.com/api/documents"; // Make sure to replace with your actual Render URL
   ```
   *(Alternatively, use `process.env.REACT_APP_API_URL` to make this dynamic).*
3. Commit and push this change to GitHub.

---

### Part 3: Deploy Frontend to Netlify (Free)
1. **Critical Step for React Router:** In your `frontend/public/` folder, ensure there is a file named exactly `_redirects` (no extension). Inside it, put this single line of text:
   ```text
   /*   /index.html   200
   ```
   *(This prevents "Page Not Found" errors when users refresh on specific routes like `/profile`)*
2. Log in to [Netlify](https://www.netlify.com).
3. Click **Add new site** > **Import an existing project**.
4. Connect your GitHub account and select your `DocuSphere` repository.
5. Set up the build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build` (If using Create React App) or `frontend/dist` (If using Vite).
6. Click **Deploy Site**.
7. Once finished, Netlify will generate a live link (e.g., `https://docusphere.netlify.app`).

### 🎉 You're Live!
Your users can now visit your Netlify link, create accounts, securely upload documents to AWS, and search for their friends' portfolios.
