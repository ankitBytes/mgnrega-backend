# MGNREGA Backend Architecture

## System Overview

The MGNREGA Backend is a Node.js + Express REST API designed to provide district-level performance data for the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) program. The system is built with scalability, caching, and daily data synchronization in mind.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Citizen Dashboards, Mobile Apps, Web Portals)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ├─ HTTP/REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express.js Application                      │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │              │  │              │  │              │         │
│  │  Controllers │──│    Routes    │──│  Middleware  │         │
│  │              │  │              │  │   (CORS,     │         │
│  └──────┬───────┘  └──────────────┘  │  Security)   │         │
│         │                             └──────────────┘         │
│         ├──────────────┐                                        │
│         ▼              ▼                                        │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │    Models    │  │   Utilities   │                           │
│  │  (Mongoose)  │  │  (DB Connect, │                           │
│  │              │  │   Helpers)    │                           │
│  └──────┬───────┘  └──────────────┘                           │
│         │                                                       │
└─────────┼───────────────────────────────────────────────────┘
          │
          ├────────────────┬─────────────────┐
          ▼                ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│   MongoDB       │ │  MGNREGA     │ │   Cache      │
│   Database      │ │  API         │ │   (Redis)    │
│                 │ │  (External)  │ │   [Future]   │
└─────────────────┘ └──────────────┘ └──────────────┘
          ▲                ▲
          │                │
          │         ┌──────┴──────┐
          │         │   Scheduled │
          └─────────┤   Jobs      │
                    │  (Daily     │
                    │   Sync)     │
                    └─────────────┘
```

## Component Description

### 1. API Layer
- **Express.js Application**: Core REST API server
- **Routes**: Define API endpoints and request handling
- **Controllers**: Business logic for data processing and validation
- **Middleware**: CORS, security (Helmet), request logging (Morgan)

### 2. Data Layer
- **Models**: Mongoose schemas for MongoDB data structure
- **MongoDB Database**: Primary data store for MGNREGA performance data
- **Data Model**: Includes state, district, block, panchayat level data with financial and employment metrics

### 3. Background Jobs
- **Data Fetch Job**: Scheduled job to fetch data from MGNREGA API
- **Cron Schedule**: Runs daily at midnight (0 0 * * *)
- **Data Processing**: Validates, transforms, and stores fetched data

### 4. Utilities
- **Database Connection**: Handles MongoDB connection and lifecycle
- **Error Handlers**: Centralized error handling and logging
- **Validation**: Input validation and sanitization

## Data Flow

1. **Client Request** → API Gateway/Load Balancer
2. **API Gateway** → Express Routes
3. **Routes** → Controllers (business logic)
4. **Controllers** → Models (data access)
5. **Models** → MongoDB (data retrieval/storage)
6. **Response** ← Formatted JSON response

## Scheduled Data Sync

1. **Cron Job Trigger** (Daily at midnight)
2. **Fetch Data** from MGNREGA API
3. **Process & Validate** data
4. **Store in MongoDB**
5. **Log Results** (success/failure)

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Graceful error responses without exposing internals

## Scalability Considerations

- **Stateless API**: Enables horizontal scaling
- **Database Indexing**: Optimized queries on frequently accessed fields
- **Caching Strategy**: Future implementation of Redis for frequently accessed data
- **Load Balancing**: Ready for deployment behind load balancers

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Scheduling**: node-cron
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## Deployment

- **Containerization**: Docker support included
- **Environment Variables**: Configuration via .env file
- **Process Management**: Ready for PM2 or similar process managers
- **Database**: MongoDB Atlas or self-hosted MongoDB

## Future Enhancements

1. **Caching Layer**: Redis integration for improved performance
2. **GraphQL API**: Alternative query interface
3. **Real-time Updates**: WebSocket support for live data
4. **Analytics**: Enhanced data analytics and reporting
5. **Geo-location**: GPS-based work site tracking
6. **Authentication**: OAuth2/JWT for secure API access
