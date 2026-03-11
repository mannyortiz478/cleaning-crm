# High-Level Overview of the CRM System on Azure

This project builds a **simple customer relationship management (CRM) system** for a
small home cleaning business. The system allows staff to manage customer
information such as contact details, service plans, and notes. It uses a
**modern cloud architecture hosted on Microsoft Azure**.

---

## Architectural Layers

The system follows a **three-tier cloud architecture**:

| Layer           | Technology                | Purpose                                  |
| --------------- | ------------------------- | ---------------------------------------- |
| **Frontend**    | React + Tailwind CSS      | User interface for managing customers    |
| **Backend API** | Azure Functions (Node.js) | Handles business logic and data requests |
| **Database**    | Azure Cosmos DB (NoSQL)   | Stores customer data                     |

These components are connected through **Azure Static Web Apps**, which hosts
the frontend and integrates the serverless API.

```
User (Web Browser)
        |
        v
React CRM Frontend
(Azure Static Web Apps)
        |
        v
Azure Functions API
(Serverless Backend)
        |
        v
Azure Cosmos DB
(NoSQL Database)
```

---

## 1. Frontend Layer (React CRM Interface)

The frontend is a **React web application** that provides the user interface for
the CRM.

### Responsibilities

- View a list of customers
- Add new customers
- Edit existing customer records
- Delete customers
- Search or filter customers
- View service details such as cleaning frequency and notes

### Key Technologies

- **React** – UI framework
- **Tailwind CSS** – styling
- **Vite** – development build tool

### Deployment

Hosted on **Azure Static Web Apps** which:

- Serves the React site over HTTPS
- Automatically deploys from GitHub
- Integrates with Azure Functions APIs

---

## 2. Backend Layer (Azure Functions API)

Serverless API endpoints built using Azure Functions handle business logic.

### What the Functions Do

| Request         | Action                   |
| --------------- | ------------------------ |
| View customers  | Query Cosmos DB          |
| Add customer    | Insert new document      |
| Edit customer   | Update existing document |
| Delete customer | Remove document          |

### REST Endpoints

```
GET /api/customers
POST /api/customers
GET /api/customer/{id}
PUT /api/customer/{id}
DELETE /api/customer/{id}
```

Functions were chosen because they scale automatically, require no server
management, and integrate cleanly with Static Web Apps.

---

## 3. Data Layer (Cosmos DB NoSQL Database)

Customer data is stored in Cosmos DB, a globally distributed NoSQL database.

### Document Example

```json
{
  "id": "cust-001",
  "firstName": "Maria",
  "lastName": "Lopez",
  "phone": "555-555-1111",
  "servicePlan": "biweekly",
  "status": "active",
  "lastCleaningDate": "2026-03-02",
  "notes": "Has two dogs"
}
```

A single database `cleaningcrm` contains a `customers` container with `/id` as
partition key. NoSQL allows flexible schemas.

---

## 4. Deployment & CI/CD

- Developer pushes code to GitHub.
- Azure Static Web Apps detects the change.
- GitHub Actions build the frontend and functions.
- Azure deploys the updated site and API.

This provides an automated pipeline with zero manual deployment steps.

---

## 5. Environment Configuration

Secrets are kept in environment variables rather than source code. The primary
variable used is:

```
COSMOS_DB_CONNECTION_STRING
```

Added under the Static Web App's environment settings and injected into the
Azure Functions runtime.

---

## 6. Example Workflow: Add Customer

1. User submits form in React UI.
2. React issues `POST /api/customers`.
3. Azure Function inserts document into Cosmos DB.
4. Database persists the record.
5. API responds; UI refreshes the list.

---

## 7. Benefits

- **Scalable** – serverless backend, globally distributed DB
- **Low maintenance** – no servers or VMs to manage
- **Cost‑effective** – pay-per-use functions, inexpensive static hosting
- **Flexible** – NoSQL schema eases data model evolution

---

## 8. Summary

The CRM system includes:

- **Frontend:** React + Tailwind, deployed on Static Web Apps
- **Backend:** Node.js Azure Functions serving RESTful endpoints
- **Database:** Cosmos DB container for customer documents
- **Deployment:** GitHub‑driven CI/CD through Azure

This architecture is ideal for small teams needing a simple, maintainable CRM
solution with cloud scalability.
