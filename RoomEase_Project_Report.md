# Detailed Project Report: RoomEase
**Next-Generation Co-Living & Accommodation Discovery Platform**

---

## 1. Abstract
The urban real estate market for shared accommodations is highly fragmented, leaving tenants struggling to find compatible roommates and property owners overwhelmed by manual property management. **RoomEase** is a comprehensive, full-stack web application designed to bridge this gap. Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), it integrates advanced features such as an AI-driven matchmaking algorithm for roommate compatibility, real-time bidirectional chat using WebSockets (Socket.io), dynamic map-based property discovery using OpenStreetMap Geocoding, and automated digital lease generation. 

## 2. Introduction
### 2.1 Background
With the rise of urban migration among students and young professionals, the demand for affordable shared housing has skyrocketed. However, existing platforms primarily act as classified boards without addressing the critical factor of *roommate compatibility* or providing end-to-end management tools for landlords.

### 2.2 Problem Statement
1. **For Tenants:** Finding a room is easy; finding a *compatible roommate* who shares similar lifestyle habits (sleep schedule, cleanliness, budget) is extremely difficult.
2. **For Owners:** Managing multiple properties, filtering through booking requests, and communicating with prospective tenants is a manual, time-consuming process.

### 2.3 Objectives
- To develop a centralized platform where users can seamlessly list, search, and book accommodations.
- To implement an intelligent scoring system that matches users based on complex lifestyle data points.
- To provide property owners with a powerful dashboard for managing listings and tenant interactions in real-time.

---

## 3. System Architecture
RoomEase follows a robust **Client-Server Architecture** utilizing RESTful APIs for standard data transmission and WebSockets for real-time interactions.

### 3.1 Frontend (Client Tier)
- Developed as a Single Page Application (SPA) using **React.js (Vite)**.
- Employs **Tailwind CSS** to achieve a modern, responsive, and accessible "Glassmorphism" UI design.
- Uses **React Router** for secure, role-based navigation (Tenant vs. Owner portals).
- Uses **Leaflet.js** for interactive map rendering.

### 3.2 Backend (Application Tier)
- Powered by **Node.js** and **Express.js**.
- Implements **JSON Web Tokens (JWT)** for stateless authentication and authorization.
- Integrates **Socket.io** alongside the HTTP server to maintain persistent, bidirectional communication channels for the chat feature.

### 3.3 Database (Data Tier)
- Utilizes **MongoDB**, a NoSQL database, hosted on MongoDB Atlas for high availability and scalability.
- Uses **Mongoose ODM** for strict schema definitions and data validation.

---

## 4. Functional Requirements (Modules)

### 4.1 Authentication & Authorization Module
- Secure user registration and login with bcrypt password hashing.
- Role-Based Access Control (RBAC): Users are strictly categorized as `tenant`, `owner`, or `admin`. 

### 4.2 Property Management Module (Owners)
- Owners can create, read, update, and delete (CRUD) property listings.
- **Automated Geocoding:** When an owner enters a text address, the backend queries the OpenStreetMap Nominatim API to fetch the exact Latitude and Longitude coordinates, storing them in the database for map plotting.

### 4.3 Search & Discovery Module (Tenants)
- Tenants can search for properties by location, budget, and room type.
- **Interactive Map:** The Explore page dynamically renders property pins on a map. Searching for a city automatically pans and zooms the map to the geocoded coordinates.

### 4.4 AI Matchmaking Module
- Tenants fill out a detailed lifestyle profile (budget, wake-up time, cleanliness, introversion/extroversion, food preferences, smoking/alcohol habits).
- The backend algorithm calculates a percentage-based **Compatibility Score** between the active user and all other users in the database, surfacing the highest-scoring matches first.

### 4.5 Booking & E-Lease Module
- Tenants can send booking requests to properties.
- Owners can review and 'Approve' or 'Reject' requests via their dashboard.
- Upon approval and deposit payment, the system dynamically generates a customized, legally formatted PDF Lease Agreement using `jspdf`.

### 4.6 Real-Time Communication Module
- Tenants and Owners can communicate instantly regarding a booking.
- Powered by WebSockets, messages are pushed to the client immediately without requiring a page refresh, utilizing isolated Socket "rooms" based on the unique Booking ID.

---

## 5. Database Schema Design

### 5.1 User Model
- **Core Info:** `name`, `email`, `password`, `role`.
- **Profile (Embedded):** `bio`, `age`, `gender`, `occupation`, `budget`, `wakeUpTime`, `cleanliness`, `introvertExtrovert`.

### 5.2 Property Model
- **Details:** `title`, `description`, `location`, `lat`, `lng`.
- **Specs:** `roomType` (Shared/Private/Entire), `rent`, `deposit`, `capacity`, `amenities` (Array).
- **Relations:** `owner` (ObjectId referencing User).

### 5.3 Booking Model
- **Details:** `status` (Pending/Approved/Rejected), `paymentStatus` (Pending/Paid).
- **Relations:** `property` (ObjectId), `tenant` (ObjectId), `owner` (ObjectId).
- **Conversation (Embedded):** Array of message objects containing `sender`, `message`, and `timestamp`.

---

## 6. Implementation Highlights & Challenges Conquered

### Real-Time Chat Integration
Integrating Socket.io required wrapping the standard Express `app` in a native Node `http.createServer`. The challenge was ensuring that messages were only broadcasted to the specific Tenant and Owner involved in a transaction. This was solved by dynamically joining Socket instances to a unique room named after the `Booking ID`.

### Geocoding Accuracy
Relying on user-inputted text for map locations is historically error-prone. RoomEase solves this by intercepting the property creation request on the server, sending the address string to the OpenStreetMap Nominatim API, and extracting precise decimal coordinates before saving the document to MongoDB.

### Accessibility (a11y)
The entire frontend was audited and overhauled to ensure strict WCAG compliance. Every form input is explicitly linked to a `<label>` using `htmlFor` and `id`, and utilizes `aria-label` attributes for screen readers, ensuring the platform is usable by everyone.

---

## 7. Conclusion and Future Scope
RoomEase successfully demonstrates how modern web technologies and AI-inspired algorithms can completely transform the rental and co-living industry. By centralizing discovery, management, and communication into a single, beautifully designed application, it eliminates the friction traditionally associated with finding housing.

**Future Enhancements:**
1. **Live Payment Gateway:** Integrating Stripe API to process actual credit card transactions for rent and security deposits.
2. **KYC Verification:** Adding a third-party identity verification service (like Onfido) to verify government IDs and increase platform trust.
3. **Maintenance Ticketing:** A dedicated module for active tenants to report plumbing, electrical, or structural issues directly to the owner's dashboard with photo uploads.
