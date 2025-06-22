# eMart 5 Star - Premium Inventory Management System

A comprehensive inventory management system built with Spring Boot backend and React frontend, featuring a chocolate-themed UI with 3D animations and complete workflow automation.

## 🚀 Features

### Backend (Spring Boot + MySQL)
- ✅ Complete REST API with Spring Boot 3.2
- ✅ MySQL database with JPA/Hibernate
- ✅ CORS configuration for cross-origin requests
- ✅ CSV import/export functionality
- ✅ Comprehensive entity management (Products, Suppliers, Inventory, Invoices, Alerts)
- ✅ Advanced repository patterns with custom queries
- ✅ Production-ready error handling and validation

### Frontend (React + TypeScript)
- ✅ Modern React 18 with TypeScript
- ✅ Chocolate and gold themed UI with 3D particle effects
- ✅ Three.js particle system background
- ✅ Framer Motion smooth animations
- ✅ TanStack Query for state management
- ✅ Responsive design with Tailwind CSS
- ✅ Advanced component library with Radix UI

## 📁 Project Structure

```
eMart-5-Star/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/emart/inventory/
│   │   ├── controller/         # REST API controllers
│   │   ├── service/           # Business logic services
│   │   ├── repository/        # Data access layer
│   │   ├── entity/           # JPA entities
│   │   ├── config/           # Configuration classes
│   │   └── InventoryApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml               # Maven dependencies
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   └── index.css        # Chocolate theme styles
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts       # Vite configuration
└── README.md                # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- MySQL 8.0
- Git

### 1. MySQL Database Setup

**Install MySQL:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql

# Windows: Download from https://dev.mysql.com/downloads/mysql/
```

**Configure MySQL:**
```bash
# Start MySQL service
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation

# Login to MySQL
mysql -u root -p
```

**Create Database:**
```sql
-- Login to MySQL and run:
CREATE DATABASE emart_inventory;
CREATE USER 'root'@'localhost' IDENTIFIED BY '12345678';
GRANT ALL PRIVILEGES ON emart_inventory.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend Setup (Spring Boot)

**Navigate to backend directory:**
```bash
cd backend
```

**Install Java dependencies:**
```bash
# Install Maven dependencies
./mvnw clean install

# Or use your system Maven
mvn clean install
```

**Configure application.properties:**
```properties
# Already configured in src/main/resources/application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/emart_inventory?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=12345678
spring.jpa.hibernate.ddl-auto=update
```

**Run the backend:**
```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run

# Or run the JAR directly after building
java -jar target/inventory-backend-0.0.1-SNAPSHOT.jar
```

**Backend will be available at:** http://localhost:8080/api

### 3. Frontend Setup (React)

**Navigate to frontend directory:**
```bash
cd frontend
```

**Install Node.js dependencies:**
```bash
npm install
```

**Start the development server:**
```bash
npm run dev
```

**Frontend will be available at:** http://localhost:3000

### 4. Verify Setup

**Check backend health:**
```bash
curl http://localhost:8080/api/dashboard/stats
```

**Check frontend:** Open http://localhost:3000 in your browser

## 📋 How to Use the System

### 1. Dashboard
- **Access:** http://localhost:3000/dashboard
- **Features:**
  - View real-time statistics (Total Products, Revenue, Suppliers, Low Stock Alerts)
  - Interactive sales trend charts
  - Top-performing products list
  - Low stock alerts with critical items

### 2. Product Management
- **Access:** http://localhost:3000/products
- **Add Products:**
  1. Click "Add Product" button
  2. Fill in product details (Name, SKU, Category, Price, etc.)
  3. Set minimum and maximum stock levels
  4. Assign supplier and category
  5. Save product

- **Import Products via CSV:**
  1. Click "Import CSV" button
  2. Upload CSV file with columns: name, sku, price, category, supplier
  3. System will validate and import products

- **Export Products:**
  1. Click "Export" button
  2. Download CSV file with all product data

### 3. Inventory Management
- **Access:** http://localhost:3000/inventory
- **Features:**
  - View stock levels across multiple locations (Warehouse, Shelf)
  - Transfer stock between locations
  - Monitor low stock items
  - Real-time inventory updates

### 4. Supplier Management
- **Access:** http://localhost:3000/suppliers
- **Add Suppliers:**
  1. Click "Add Supplier" button
  2. Enter supplier details (Name, Contact Person, Email, Phone)
  3. Add address and GST information
  4. Save supplier record

### 5. Invoice Management
- **Access:** http://localhost:3000/invoices
- **Features:**
  - Create purchase orders
  - Track payment status
  - Generate PDF invoices
  - Monitor due dates and overdue payments

### 6. Reports & Analytics
- **Access:** http://localhost:3000/reports
- **Generate Reports:**
  - Sales reports with revenue analysis
  - Inventory reports with stock valuation
  - Growth reports with trend analysis
  - Export reports in PDF/Excel/CSV formats

### 7. Alert System
- **Access:** http://localhost:3000/alerts
- **Alert Types:**
  - **Critical:** Items with extremely low stock
  - **Warning:** Items approaching minimum stock level
  - **Info:** General notifications and updates
  - **Payment Due:** Invoice payment reminders

## 🔧 Backend API Testing

### Using cURL Commands

**Get Dashboard Statistics:**
```bash
curl -X GET http://localhost:8080/api/dashboard/stats
```

**Get All Products:**
```bash
curl -X GET http://localhost:8080/api/products
```

**Create a New Product:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Basmati Rice",
    "sku": "RICE001",
    "sellingPrice": 450.00,
    "purchasePrice": 400.00,
    "unit": "kg",
    "minStockLevel": 50,
    "maxStockLevel": 500
  }'
```

**Get All Categories:**
```bash
curl -X GET http://localhost:8080/api/categories
```

**Create a Category:**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grains & Rice",
    "description": "Various types of grains and rice products"
  }'
```

**Get All Suppliers:**
```bash
curl -X GET http://localhost:8080/api/suppliers
```

**Create a Supplier:**
```bash
curl -X POST http://localhost:8080/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Farm Fresh Co.",
    "contactPerson": "John Smith",
    "email": "contact@farmfresh.com",
    "phone": "+91-9876543210",
    "address": "123 Farm Street",
    "city": "Punjab",
    "state": "Punjab",
    "pincode": "123456"
  }'
```

## 🗄️ How to View Data in MySQL

### Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p
# Enter password: 12345678

# Use the database
USE emart_inventory;

# View all tables
SHOW TABLES;

# View products
SELECT * FROM products;

# View categories
SELECT * FROM categories;

# View suppliers
SELECT * FROM suppliers;

# View inventory
SELECT * FROM inventory;

# Join query - Products with categories
SELECT p.name, p.sku, p.selling_price, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id;

# Join query - Products with suppliers
SELECT p.name, p.sku, s.name as supplier_name, s.contact_person 
FROM products p 
LEFT JOIN suppliers s ON p.supplier_id = s.id;
```

### Using MySQL Workbench (GUI)
1. **Install MySQL Workbench:** https://dev.mysql.com/downloads/workbench/
2. **Connect to Database:**
   - Host: localhost
   - Port: 3306
   - Username: root
   - Password: 12345678
3. **Navigate to Schema:** emart_inventory
4. **Browse Tables:** products, categories, suppliers, inventory, etc.

### Using phpMyAdmin (Web Interface)
1. **Install phpMyAdmin:**
   ```bash
   # Ubuntu/Debian
   sudo apt install phpmyadmin
   
   # Or use Docker
   docker run --name phpmyadmin -d -e PMA_HOST=localhost -p 8081:80 phpmyadmin
   ```
2. **Access:** http://localhost:8081
3. **Login:** root / 12345678
4. **Select Database:** emart_inventory

## 🎨 UI Theme and Design

### Chocolate Theme Colors
- **Primary Gold:** `#fbbf24` (Gold buttons and accents)
- **Background:** Rich chocolate gradients
- **Cards:** Glassmorphism with chocolate tints
- **Text:** Gold and cream colors for premium feel

### 3D Effects
- **Particle Background:** Three.js floating particles in gold/chocolate colors
- **Animations:** Framer Motion for smooth transitions
- **Hover Effects:** 3D button transformations and card lifting
- **Glassmorphism:** Semi-transparent cards with blur effects

## 🚀 Production Deployment

### Backend Deployment
```bash
# Build the application
./mvnw clean package -DskipTests

# Run the JAR file
java -jar target/inventory-backend-0.0.1-SNAPSHOT.jar

# Or use Docker
docker build -t emart-backend .
docker run -p 8080:8080 emart-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve using nginx or any web server
# Built files are in the 'dist' directory
```

## 🐛 Troubleshooting

### Common Issues

**1. MySQL Connection Error:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Reset MySQL password if needed
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
FLUSH PRIVILEGES;
```

**2. Port Already in Use:**
```bash
# Find process using port 8080
sudo lsof -i :8080

# Kill the process
sudo kill -9 <PID>
```

**3. Frontend Build Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Backend Build Issues:**
```bash
# Clean Maven cache
./mvnw clean

# Force download dependencies
./mvnw dependency:purge-local-repository
```

## 📝 Sample Data for Testing

### Categories
```sql
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Grains & Rice', 'Various types of grains and rice products', NOW(), NOW()),
('Dairy Products', 'Milk, cheese, yogurt and dairy items', NOW(), NOW()),
('Sweeteners', 'Honey, sugar and sweetening products', NOW(), NOW()),
('Beverages', 'Tea, coffee and drink products', NOW(), NOW());
```

### Suppliers
```sql
INSERT INTO suppliers (name, contact_person, email, phone, address, city, state, pincode, is_active, created_at, updated_at) VALUES
('Farm Fresh Co.', 'John Smith', 'contact@farmfresh.com', '+91-9876543210', '123 Farm Street', 'Punjab', 'Punjab', '123456', true, NOW(), NOW()),
('Pure Naturals', 'Sarah Johnson', 'info@purenaturals.com', '+91-8765432109', '456 Organic Lane', 'Kerala', 'Kerala', '654321', true, NOW(), NOW()),
('Local Dairy', 'Mike Wilson', 'orders@localdairy.com', '+91-7654321098', '789 Dairy Road', 'Gujarat', 'Gujarat', '987654', true, NOW(), NOW());
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for eMart 5 Star inventory management.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Made with ❤️ for eMart 5 Star Premium Inventory Management**