# 🛍️ HienStore

> Modern e-commerce platform for fashion & clothing — Built from scratch with enterprise-grade architecture

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Overview

HienStore is a full-featured e-commerce web application for selling fashion and clothing products. It features a modern, responsive UI with dark mode support, real-time chat via WebSocket, AI-powered chatbot, VNPay payment integration, and a comprehensive admin dashboard.

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.3** | REST API framework |
| **Java 21** | Language (with modern features) |
| **Spring Security** | Authentication & authorization |
| **JWT (RS256)** | Stateless token-based auth |
| **Spring Data JPA** | Database ORM |
| **MySQL 8** | Relational database |
| **Redis** | Caching & session management |
| **WebSocket (STOMP)** | Real-time messaging |
| **Spring AI** | AI chatbot (Gemini 2.0) |
| **MapStruct** | Object mapping |
| **SpringDoc OpenAPI** | API documentation (Swagger UI) |
| **iText** | PDF generation (invoices) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite 7** | Build tool & dev server |
| **TailwindCSS 4** | Utility-first CSS |
| **Redux Toolkit** | State management |
| **RTK Query** | Data fetching & caching |
| **React Router 7** | Client-side routing |
| **Framer Motion** | Animations |
| **Recharts** | Dashboard charts |
| **Axios** | HTTP client |

### DevOps
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

## Architecture

```
┌─────────────┐     ┌─────────────────────────────────────┐
│   Browser    │     │          Backend (Spring Boot)       │
│ React + TS   │◄───►│                                     │
│ Vite + TW    │     │  Controller → Service → Repository  │
└─────────────┘     │         │          │                 │
                    │         ▼          ▼                 │
                    │    ┌────────┐ ┌────────┐             │
                    │    │ Redis  │ │ MySQL  │             │
                    │    │ Cache  │ │   DB   │             │
                    │    └────────┘ └────────┘             │
                    │                                     │
                    │    WebSocket (STOMP) ◄──► Chat      │
                    │    Spring AI ◄──► Gemini API        │
                    │    VNPay SDK ◄──► Payment Gateway   │
                    └─────────────────────────────────────┘
```

## Features

### Customer
- 🔐 Register / Login (Email + Google OAuth2)
- 📱 Phone verification via OTP
- 🛍️ Browse products with filters (category, price, color, size)
- 🔍 Real-time product search
- 🛒 Shopping cart management
- 💳 Checkout with VNPay / COD payment
- 📋 Order tracking & history
- 🏷️ Discount codes & coupons
- ❤️ Wishlist / Favorites
- ⭐ Product reviews & ratings
- 💬 Real-time chat with staff (WebSocket)
- 🤖 AI chatbot (Gemini 2.0 Flash)
- 🌙 Dark mode
- 🏅 Membership tiers (Copper → Silver → Gold)

### Admin
- 📊 Dashboard with analytics charts
- 👥 User management
- 📦 Product management (variants, images)
- 📂 Category management
- 🏪 Inventory / Stock management
- 🏷️ Discount & promotion management
- 📋 Order management
- 📝 Cancel/Return request handling
- 💬 Customer chat management

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8 (or use Docker)
- Redis 7 (or use Docker)

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone https://github.com/ngochien-dev/HienStore.git
cd HienStore

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker compose up -d

# 4. Access the application
# Backend API: http://localhost:8080
# Swagger UI:  http://localhost:8080/swagger-ui.html
```

### Manual Setup

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Project Structure

```
HienStore/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/hienstore/
│   │   ├── config/             # Configuration classes
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── enums/              # Enum types
│   │   ├── exception/          # Exception handling
│   │   ├── mapper/             # MapStruct mappers
│   │   ├── repository/         # Data access layer
│   │   ├── security/           # Security config & JWT
│   │   ├── service/            # Business logic
│   │   └── websocket/          # WebSocket handlers
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # API client & endpoints
│   │   ├── app/                # Redux store
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Utilities
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml          # MySQL + Redis + Backend
├── .env.example                # Environment template
└── README.md
```

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Author**: Nguyen Ngoc Hien  
**GitHub**: [@ngochien-dev](https://github.com/ngochien-dev)
