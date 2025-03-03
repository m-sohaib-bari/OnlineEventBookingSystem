# 🎟️ Event Booking Platform

## 📌 Overview
This is a microservices-based **Online Event Booking Platform** that allows users to **browse events, book tickets, and receive notifications**.

## 🏢 Architecture  
### **Microservices**  
- 🟢 **User Service** (FastAPI/Express.js + PostgreSQL)  
- 🟡 **Event Service** (Spring Boot/Node.js + MongoDB)  
- 🔵 **Booking Service** (Flask/Express.js + PostgreSQL)  
- 🔴 **Notification Service** (Flask/Express.js + MongoDB)  

### **Communication**  
- **Synchronous**: REST APIs  
- **Asynchronous**: RabbitMQ (Event-driven messaging)  

## 📂 Repository Structure  
```
event-booking-platform/
│── user-service/         # FastAPI / Express.js + PostgreSQL
│── event-service/        # Spring Boot / Node.js + MongoDB
│── booking-service/      # Flask / Express.js + PostgreSQL
│── notification-service/ # Flask / Express.js + MongoDB
│── docs/                 # Documentation, screenshots, architecture diagram
│── README.md             # Main documentation file
│── .gitignore            # Ignore unnecessary files
│── docker-compose.yml    # (Optional) For running all services together
```

## 🚀 Setup Guide  
### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/your-username/event-booking-platform.git
cd event-booking-platform
```

### **2️⃣ Start Each Microservice**  
Go to each service folder and run:  
#### **User Service (FastAPI/Express.js)**  
```bash
cd user-service
pip install -r requirements.txt   # (Python) Flask/FastAPI
npm install                      # (JavaScript) Express.js
```
#### **Event Service (Spring Boot/Node.js)**  
```bash
cd event-service
mvn spring-boot:run  # (Java)
npm install && node server.js  # (Node.js)
```
#### **Booking Service (Flask/Express.js)**  
```bash
cd booking-service
pip install -r requirements.txt
```
#### **Notification Service (Flask/Express.js)**  
```bash
cd notification-service
pip install -r requirements.txt
```

### **3️⃣ Running with Docker (Optional)**  
If you want to run all services in containers:  
```bash
docker-compose up --build
```

---

## 🐟 API Documentation  
Each service exposes RESTful endpoints.  
Use `Swagger/OpenAPI` for better documentation.  

### **User Service API**  
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| `GET`  | `/users`     | Get all users       |
| `POST` | `/users`     | Create a new user   |

### **Event Service API**  
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| `GET`  | `/events`    | Get all events      |
| `POST` | `/events`    | Create a new event  |

### **Booking Service API**  
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| `POST` | `/bookings`  | Create a booking    |
| `GET`  | `/bookings`  | List bookings       |

### **Notification Service API**  
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| `POST` | `/notifications` | Send notification |
| `GET`  | `/notifications` | View notifications |

Swagger UI can be accessed at:  
- `http://localhost:8000/docs` (FastAPI)  
- `http://localhost:8080/swagger-ui.html` (Spring Boot)  

---

## 🏆 Expected Deliverables  
1️⃣ **Fully functional microservices** (User, Event, Booking, Notification)  
2️⃣ **Working Jira board** with tasks, progress tracking, and GitHub integration  
3️⃣ **GitHub repository** with:  
   - 🐝 **README.md** (Architecture, API docs, setup guide)  
   - 💻 **Source code** for each microservice  
   - 👀 **API specification** (Swagger/OpenAPI)  
4️⃣ **Architectural Diagram** (Illustrating microservice communication)  
5️⃣ **Screenshots of Jira-GitHub Integration** (as a document inside `docs/`)  

---

## 📄 Jira & GitHub Integration
To integrate Jira with GitHub:  
1️⃣ **In Jira**: Go to *Apps > GitHub* and connect your repository.  
2️⃣ **In GitHub**: Install the Jira GitHub app and link issues via commit messages (e.g., `fixes PROJECT-123`).  
3️⃣ **Verify** the integration by checking if Jira issues update automatically from GitHub commits.  

**Screenshots of the integration should be added to the `docs/` folder.**  

---

## 📈 Contribution Guidelines  
1️⃣ Fork the repository.  
2️⃣ Create a feature branch.  
3️⃣ Commit changes and create a pull request.  

---

## 📧 Contact  
For questions, contact **Your Name** at `your-email@example.com`.  

---

🚀 **Let's build a scalable event booking system!** 🏟️🎟️

