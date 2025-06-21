# eMart 5 Star - Premium Inventory Management System

## Overview

eMart 5 Star is a comprehensive inventory management system built for grocery businesses. It provides advanced analytics, real-time tracking, and intelligent automation features. The application uses a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom chocolate/gold theme
- **UI Components**: Radix UI components via shadcn/ui
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite for development and bundling
- **3D Graphics**: Three.js for particle effects and visual enhancements

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API with CRUD operations
- **Session Management**: Built-in session handling

### Key Components

#### Database Schema
The system uses a comprehensive schema with the following main entities:
- **Users**: Role-based access (admin, maker, checker, user)
- **Products**: SKU-based product catalog with categories
- **Inventory**: Multi-location stock tracking with reservations
- **Suppliers**: Vendor management with contact details
- **Invoices**: Purchase order and billing system
- **Alerts**: Automated notifications for stock levels and expirations
- **Stock Movements**: Audit trail for inventory changes

#### Core Modules
1. **Dashboard**: Real-time business analytics and KPIs
2. **Product Management**: CRUD operations with barcode generation
3. **Inventory Tracking**: Multi-location stock management
4. **Supplier Management**: Vendor relationship management
5. **Invoice Processing**: Purchase order workflow
6. **Reports & Analytics**: Business intelligence and reporting
7. **Alert System**: Automated notifications and warnings

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests and validate input
3. **Business Logic**: Storage layer implements business rules and operations
4. **Database**: Drizzle ORM manages PostgreSQL interactions
5. **Real-time Updates**: Query invalidation provides reactive updates

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI framework (Radix UI components, Tailwind CSS)
- Development tools (Vite, TypeScript, ESLint)
- Utilities (date-fns, clsx, class-variance-authority)

### Backend Dependencies
- Database (Drizzle ORM, Neon PostgreSQL adapter)
- Server framework (Express, session management)
- Development tools (tsx, esbuild, TypeScript)

### Database
- **Provider**: Neon serverless PostgreSQL
- **Configuration**: Environment-based connection via DATABASE_URL
- **Migration**: Drizzle Kit for schema management

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20, PostgreSQL 16 modules
- **Development Server**: Vite dev server with HMR
- **Database**: Provisioned PostgreSQL instance
- **Port Configuration**: Application runs on port 5000

### Production Deployment
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Target**: Autoscale deployment on Replit
- **Assets**: Static files served from dist/public
- **Environment**: Production optimizations enabled

### Build Configuration
- **Frontend**: Vite builds React app to dist/public
- **Backend**: esbuild bundles server code to dist/index.js
- **Static Assets**: Express serves built frontend in production

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 21, 2025. Initial setup