# 🌐 Kisan Traders : Full Stack MERN Web Application

A Full Stack Web Application built using the **MERN Stack** (MongoDB, Express, React, Node.js).
This project includes **user authentication, product management, and modern UI** with secure backend APIs.

---

# 🚀 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary (for image upload)

---

# 📂 Project Structure

```
project-root
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── database
│   ├── utils
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```
git clone https://github.com/priyanshuuuraj/KisanTraders.git
```

```
cd KisanTraders
```

---

# 📦 Install Dependencies

## Backend

```
cd backend
npm install
```

## Frontend

```
cd frontend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the **backend folder**.

```
PORT=****
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Running the Project

## Start Backend Server

```
cd backend
npm run dev
```

Backend will run on:

```
http://localhost:8000
```

---

## Start Frontend

```
cd frontend
npm run dev
```

Frontend will run on:

```
https://kisantraders.onrender.com
```

---

# ✨ Features

* User Authentication (Signup / Login)
* Secure JWT Authentication
* Product Listing
* Add to Cart
* Profile Update
* Image Upload with Cloudinary
* Responsive UI
* REST API Integration

---

# 🛠 API Endpoints

## User

```
POST /api/v1/user/register
POST /api/v1/user/login
PUT  /api/v1/user/update/:id
```

## Products

```
GET    /api/v1/products
POST   /api/v1/products
DELETE /api/v1/products/:id
```

---

# 📸 Screenshots

You can add screenshots of your project here.

```
![Home Page](screenshots/home.png)
![Product Page](screenshots/product.png)
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

# 👩‍💻 Author

**Priyanshu Raj**

GitHub:
https://github.com/priyanshuuuraj

---

# ⭐ Support

If you like this project, please ⭐ the repository.
