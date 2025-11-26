# 🚀 CRUDDER – AWS Cloud Learning Journey

This repository documents my complete AWS learning journey through a **hands-on Twitter-style project** called **CRUDDER** — a basic social app where users can post, like, and comment — built using **TypeScript**, **React**, and **Node.js**.  
Each milestone aligns with weekly AWS Cloud concepts, DevOps practices, and architecture components from the **AWS Cloud Project Bootcamp**.

---

## 🧠 Project Overview

**Goal:** Learn AWS by building and deploying a production-ready full-stack app.  
**Frontend:** React + TypeScript  
**Backend:** Node.js + Express + TypeScript  
**Database:** PostgreSQL (RDS) & DynamoDB (for performance and caching)  
**Infra:** AWS ECS Fargate, CloudFormation, CodePipeline, CloudFront, and S3

## Preview

**Sign-up Page**

![Sign-up Page](/assets/SignUp.png)

**Login Page**

![Login Page](/assets/Login.png)

**Home Page**

![Home Page](/assets/home.png)

**Profile Page**

![Profile Page](/assets/profile.png)

**Notification Page**

![Notification Page](/assets/notificatio.png)

**More Page**

![More Page](/assets/more.png)

**Tweet Page**

![Tweet Page](/assets/tweet.png)

---

## 🗂️ Architecture Summary

| Layer          | Service                               | Purpose                               |
| -------------- | ------------------------------------- | ------------------------------------- |
| **Frontend**   | React + CloudFront + S3               | Host static app with CDN              |
| **Backend**    | Node.js on ECS Fargate                | Run scalable REST APIs                |
| **Database**   | +MongoDB + DynamoDB                   | Store relational + NoSQL data         |
| **Auth**       | Amazon Cognito                        | Manage users and JWT authentication   |
| **Monitoring** | CloudWatch, X-Ray, Honeycomb, Rollbar | Observability & error tracking        |
| **CI/CD**      | CodeBuild + CodePipeline              | Continuous integration and deployment |
| **IaC**        | AWS CloudFormation + SAM              | Infrastructure as code                |
| **Networking** | VPC + Load Balancer + Security Groups | Secure and isolated networking setup  |

---

## 🧩 Weekly Learning Breakdown

### **Week 0 – Setup & Architecture**

- Create GitHub, Gitpod, and AWS accounts
- Set up MFA and billing alarms
- Learn AWS IAM, Organizations, and budgeting
- Build initial project architecture using **Lucidchart**

### **Week 1 – Containerization & Security**

- Dockerize the backend (Node.js)
- Understand Docker container security best practices
- Compare DynamoDB and Postgres for app needs

### **Week 2 – Observability**

- Implement **AWS X-Ray**, **CloudWatch Logs**, **Rollbar**, and **Honeycomb**
- Learn **distributed tracing** and monitoring differences
- Add basic notification services

### **Week 3 – Authentication**

- Build **decentralized auth** using **Amazon Cognito**
- Customize⏳ Cognito login/signup pages
- Verify JWTs on the backend

### **Week 4 – Databases**

- Secure RDS Postgres instance
- Learn relational modeling for CRUDDER
- Integrate Cognito post-confirmation Lambda

### **Week 5 – NoSQL & Caching**

- Learn DynamoDB for scalable feed storage
- Implement caching with DynamoDB Streams
- Explore ECS and Fargate security best practices

### **Weeks 6–7 – ECS & Deployment**

- Deploy containerized backend to **ECS Fargate**
- Configure Load Balancing, CORS, and domains
- Enable **Container Insights** and secure network layer

### **Week 8 – Serverless & Media**

- Serverless image processing using **AWS Lambda + CDK**
- Store and serve avatars via **S3 + CloudFront**
- Create user profile pages and migration endpoints

### **Week 9 – CI/CD**

- Automate builds with **AWS CodeBuild**
- Deploy via **AWS CodePipeline**
- Understand CI/CD security fundamentals

### **Weeks 10–11 – Infrastructure as Code**

- Learn **CloudFormation (CFN)** deeply
- Build Networking, Cluster, and Service layers with CFN
- Create CI/CD and static frontend hosting using IaC

### **Final Week – Validation & Cleanup**

- Connect DBs and Lambdas
- Implement refactored JWT decorators and error handling
- Build the **CRUDDER Activity Feed**
- Clean up project structure and prepare for deployment

---

## 🧰 Tools & Accounts Used

| Tool                     | Purpose                      |
| ------------------------ | ---------------------------- |
| GitHub                   | Version control & Codespaces |
| Gitpod / Cloud9          | Cloud IDE                    |
| Lucidchart               | Architecture diagrams        |
| Honeycomb                | Observability                |
| Rollbar                  | Error tracking               |
| AWS CLI                  | CLI automation & credentials |
| Docker                   | Containerization             |
| CloudFormation           | Infrastructure as Code       |
| Cognito                  | Authentication               |
| CodePipeline / CodeBuild | CI/CD                        |
| ECS Fargate              | App container deployment     |
| CloudWatch / X-Ray       | Logs & traces                |

---

## 📈 Progress Tracker

| Week  | Focus             | Status      |
| ----- | ----------------- | ----------- |
| 0     | Setup & IAM       | Done        |
| 1     | Docker & Security | Done        |
| 2     | Observability     | In progress |
| 3     | Authentication    | ⏳          |
| 4     | Databases         | ⏳          |
| 5     | NoSQL & Caching   | ⏳          |
| 6–7   | ECS & Deployment  | ⏳          |
| 8     | Serverless Media  | ⏳          |
| 9     | CI/CD             | ⏳          |
| 10–11 | CloudFormation    | ⏳          |
| X     | Final Validation  | ⏳          |

---

## 🧑‍💻 Learning Goals

- Master AWS developer ecosystem
- Understand DevOps workflow (CI/CD, IaC, security)
- Deploy real-world full-stack app in AWS
- Learn best practices for observability, cost management, and scalability

---

## ⚙️ Tech Stack

**Frontend:** React, TypeScript, TailwindCSS  
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL (RDS), DynamoDB  
**Auth:** Cognito  
**Infra:** ECS Fargate, CloudFormation, Lambda, S3, CloudFront  
**DevOps:** CodeBuild, CodePipeline, GitHub Actions  
**Monitoring:** CloudWatch, X-Ray, Rollbar, Honeycomb

---

## 📘 Journal

Every week I’ll document:

- Key takeaways from AWS bootcamp
- Architecture updates for CRUDDER
- Debugging and optimization notes
- DevOps workflows and reflections

---

## 🙏 Special Thanks

A huge thanks to **[freeCodeCamp](https://www.freecodecamp.org/)** for providing the **free AWS Cloud Project Bootcamp** — a detailed and hands-on resource that makes learning AWS accessible for everyone.  
Their structured tutorials form the foundation for this learning journey and the CRUDDER project. They have made the application with python and flask as framewok.

---

## 🏁 Outcome

By the end of this journey, **CRUDDER** will be:

- Fully deployed on AWS (frontend + backend)
- Scalable, observable, and secure
- A showcase of practical AWS Cloud proficiency

---

## 📄 License

MIT License © 2025 Harshit

---

> “The best way to learn cloud is to build something that scales.” — Anonymous
