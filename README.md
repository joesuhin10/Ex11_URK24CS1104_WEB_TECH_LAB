# ToyNest - Online Toy Store (URK24CS1104)

> **Live Website Demo**: [https://joesuhin10.github.io/Ex11_URK24CS1104_WEB_TECH_LAB/](https://joesuhin10.github.io/Ex11_URK24CS1104_WEB_TECH_LAB/)

Full stack CRUD web application: **React.js (Vite)** frontend + **Node.js/Express.js** REST API + **MongoDB**.
Database: `ToyStoreDB`, collection: `toys`.

---

## 🌐 Live Website
The app is deployed on GitHub Pages at:
👉 **[https://joesuhin10.github.io/Ex11_URK24CS1104_WEB_TECH_LAB/](https://joesuhin10.github.io/Ex11_URK24CS1104_WEB_TECH_LAB/)**

*Note: Since GitHub Pages hosts static web apps, the online demo automatically uses the built-in browser localStorage store to demonstrate full CRUD operations (add, view, edit, delete toys).*

---

## 📁 Folder Structure
```
ToyStoreApp/
├── .github/workflows/deploy.yml   Automated GitHub Pages deployment
├── backend/
│   ├── server.js                  Express REST API (GET, POST, PUT, DELETE) + MongoDB
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/                       main.jsx, App.jsx, App.css, api.js
├── screenshots/                   Output figures 1-6
├── Ex11_URK24CS1104_WEB_TECH_LAB.pdf  Lab record document
└── README.md
```

---

## 🚀 Run Locally with MongoDB Backend

1. **Start MongoDB Community Server** (default `mongodb://127.0.0.1:27017`).
2. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. **Start the backend server**:
   ```bash
   cd ../backend
   npm install
   node server.js
   ```
4. **Open in browser**:
   ```
   http://localhost:3000
   ```

---

## 📸 Screenshots
The `screenshots/` directory contains verification images for all CRUD operations:
- `1-empty-catalogue.png`
- `2-validation-errors.png`
- `3-create-and-read.png`
- `4-editing-toy.png`
- `5-update-result.png`
- `6-delete-result.png`
