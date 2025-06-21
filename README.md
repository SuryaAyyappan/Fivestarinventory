# eMart 5 Star - Premium Inventory Management System

A comprehensive inventory management system with Spring Boot backend and React frontend, featuring chocolate-themed UI with 3D animations.

## Features

### Backend (Spring Boot + MySQL)
- Complete REST API with Spring Boot 3.2
- MySQL database with JPA/Hibernate
- JWT authentication and authorization
- CSV import/export functionality
- Comprehensive entity management (Products, Suppliers, Inventory, Invoices, Alerts)
- Advanced repository patterns with custom queries
- Production-ready error handling and validation

### Frontend (React + TypeScript)
- Modern React 18 with TypeScript
- Chocolate and gold themed UI with 3D effects
- Three.js particle system background
- Framer Motion animations
- TanStack Query for state management
- Responsive design with Tailwind CSS
- Advanced component library with Radix UI

## Project Structure

```
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source files
│   ├── src/main/resources/ # Application properties
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source files
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # Project documentation
```

## Setup Instructions

### Backend Setup
1. Ensure MySQL is running with credentials:
   - Host: localhost:3306
   - Username: root
   - Password: 12345678
   - Database: emart_inventory (will be created automatically)

2. Navigate to backend directory:
   ```bash
   cd backend
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will be available at http://localhost:8080/api

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Key Features

### Dashboard
- Real-time statistics and KPIs
- Interactive charts with sales trends
- Low stock alerts and notifications
- Top-performing products analysis

### Product Management
- Complete CRUD operations
- SKU-based product identification
- Category and supplier management
- Stock level monitoring
- CSV import/export functionality

### Inventory Management
- Multi-location stock tracking (warehouse/shelf)
- Stock transfer between locations
- Automated low stock alerts
- Real-time inventory updates

### Supplier Management
- Vendor contact information
- Performance tracking
- Payment status monitoring
- Communication history

### Invoice Management
- GST calculation and tax handling
- Payment tracking and reminders
- PDF generation and export
- Automated due date alerts

### Reports & Analytics
- Comprehensive business intelligence
- Custom report generation
- Export in multiple formats (PDF, Excel, CSV)
- Scheduled report delivery

### Alert System
- Smart notification system
- Priority-based alerts (Critical, Warning, Info)
- Multi-channel notifications
- Automated trigger conditions

## Technology Stack

### Backend
- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- MySQL 8.0
- Maven
- JWT for authentication
- OpenCSV for file operations

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Three.js (3D animations)
- Framer Motion (animations)
- TanStack Query (state management)
- Radix UI (component library)
- React Router (routing)
- Recharts (data visualization)

## API Endpoints

### Products
- GET /api/products - List products with pagination
- GET /api/products/{id} - Get product by ID
- POST /api/products - Create new product
- PUT /api/products/{id} - Update product
- DELETE /api/products/{id} - Delete product
- POST /api/products/import - Import products from CSV
- GET /api/products/export - Export products to CSV

### Suppliers
- GET /api/suppliers - List all suppliers
- GET /api/suppliers/{id} - Get supplier by ID
- POST /api/suppliers - Create new supplier
- PUT /api/suppliers/{id} - Update supplier
- DELETE /api/suppliers/{id} - Delete supplier

### Inventory
- GET /api/inventory - List inventory items
- GET /api/inventory/product/{productId} - Get inventory for product
- PUT /api/inventory/{id} - Update inventory
- POST /api/inventory/transfer - Transfer stock between locations

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics
- GET /api/dashboard/low-stock - Get low stock products
- GET /api/dashboard/top-selling - Get top selling products

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=emart_inventory
JWT_SECRET=your-super-secret-jwt-key-here
```

### Frontend
No additional environment variables required for development.

## Deployment

### Backend Deployment
1. Build the application:
   ```bash
   ./mvnw clean package
   ```

2. Run the JAR file:
   ```bash
   java -jar target/inventory-backend-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```

2. Serve the built files from the `dist` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for eMart 5 Star inventory management.