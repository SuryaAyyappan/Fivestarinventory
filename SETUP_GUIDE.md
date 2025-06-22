# eMart 5 Star - Complete Setup Guide

## 🎯 Quick Start Checklist

- [ ] Install Prerequisites (Java 17, Node.js 18+, MySQL 8.0)
- [ ] Setup MySQL Database
- [ ] Configure Backend (Spring Boot)
- [ ] Setup Frontend (React)
- [ ] Test the Application
- [ ] Add Sample Data

## 🔧 Step-by-Step Installation

### Step 1: Install Prerequisites

**Java 17:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Windows: Download from https://adoptium.net/
```

**Node.js 18+:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows: Download from https://nodejs.org/
```

**MySQL 8.0:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql

# Windows: Download from https://dev.mysql.com/downloads/mysql/
```

### Step 2: MySQL Database Configuration

**Start MySQL Service:**
```bash
# Linux
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql

# Windows: Use MySQL Workbench or Command Line
```

**Secure MySQL Installation:**
```bash
sudo mysql_secure_installation
# Follow prompts to set root password and secure installation
```

**Create Database and User:**
```bash
# Login to MySQL
mysql -u root -p

# Run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE emart_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (if needed)
CREATE USER 'emart_user'@'localhost' IDENTIFIED BY '12345678';

-- Grant privileges
GRANT ALL PRIVILEGES ON emart_inventory.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON emart_inventory.* TO 'emart_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### Step 3: Backend Setup (Spring Boot)

**Clone or navigate to project:**
```bash
cd /path/to/your/project/backend
```

**Verify application.properties:**
```properties
# File: src/main/resources/application.properties
server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/emart_inventory?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=12345678
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

logging.level.com.emart=DEBUG
```

**Install backend dependencies:**
```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies using Maven wrapper
./mvnw clean install

# Or use system Maven
mvn clean install
```

**Run the backend:**
```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run

# Backend will start at http://localhost:8080/api
```

**Test backend is running:**
```bash
# In a new terminal, test the API
curl http://localhost:8080/api/dashboard/stats

# Expected response: JSON with dashboard statistics
```

### Step 4: Frontend Setup (React)

**Navigate to frontend directory:**
```bash
cd frontend
```

**Install frontend dependencies:**
```bash
# Install all Node.js dependencies
npm install

# This will install React, TypeScript, Vite, Tailwind CSS, etc.
```

**Verify proxy configuration:**
```typescript
// File: frontend/vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ... other aliases
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

**Start the frontend:**
```bash
# Start development server
npm run dev

# Frontend will start at http://localhost:3000
```

### Step 5: Verify Complete Setup

**Check both services are running:**
```bash
# Backend health check
curl http://localhost:8080/api/dashboard/stats

# Frontend accessibility
curl http://localhost:3000
```

**Open in browser:**
1. Frontend: http://localhost:3000
2. Backend API: http://localhost:8080/api/dashboard/stats

### Step 6: Add Sample Data

**Using MySQL Command Line:**
```sql
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE emart_inventory;

-- Insert sample categories
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Grains & Rice', 'Various types of grains and rice products', NOW(), NOW()),
('Dairy Products', 'Milk, cheese, yogurt and dairy items', NOW(), NOW()),
('Sweeteners', 'Honey, sugar and sweetening products', NOW(), NOW()),
('Beverages', 'Tea, coffee and drink products', NOW(), NOW()),
('Spices & Condiments', 'Spices, herbs and condiments', NOW(), NOW());

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, city, state, pincode, is_active, created_at, updated_at) VALUES
('Farm Fresh Co.', 'John Smith', 'contact@farmfresh.com', '+91-9876543210', '123 Farm Street', 'Chandigarh', 'Punjab', '160001', true, NOW(), NOW()),
('Pure Naturals', 'Sarah Johnson', 'info@purenaturals.com', '+91-8765432109', '456 Organic Lane', 'Kochi', 'Kerala', '682001', true, NOW(), NOW()),
('Local Dairy', 'Mike Wilson', 'orders@localdairy.com', '+91-7654321098', '789 Dairy Road', 'Ahmedabad', 'Gujarat', '380001', true, NOW(), NOW()),
('Spice Masters', 'Raj Patel', 'sales@spicemasters.com', '+91-6543210987', '321 Spice Market', 'Mumbai', 'Maharashtra', '400001', true, NOW(), NOW());

-- Insert sample products
INSERT INTO products (name, description, sku, category_id, supplier_id, unit, purchase_price, selling_price, mrp, gst_rate, hsn_code, min_stock_level, max_stock_level, is_active, created_at, updated_at) VALUES
('Premium Basmati Rice', 'Long grain premium basmati rice', 'RICE001', 1, 1, 'kg', 400.00, 450.00, 500.00, 5.00, '1006', 50, 500, true, NOW(), NOW()),
('Organic Honey', 'Pure organic honey from natural sources', 'HON001', 3, 2, 'bottle', 280.00, 320.00, 350.00, 12.00, '0409', 30, 200, true, NOW(), NOW()),
('Fresh Milk 1L', 'Fresh full cream milk', 'MILK001', 2, 3, 'liter', 50.00, 60.00, 65.00, 5.00, '0401', 100, 1000, true, NOW(), NOW()),
('Whole Wheat Flour', 'Organic whole wheat flour', 'FLOUR001', 1, 1, 'kg', 35.00, 45.00, 50.00, 5.00, '1101', 40, 300, true, NOW(), NOW()),
('Green Tea Bags', 'Premium green tea bags', 'TEA001', 4, 2, 'box', 150.00, 180.00, 200.00, 18.00, '0902', 20, 150, true, NOW(), NOW()),
('Turmeric Powder', 'Pure turmeric powder', 'TUR001', 5, 4, 'packet', 80.00, 100.00, 120.00, 12.00, '0910', 25, 200, true, NOW(), NOW());

-- Insert sample inventory
INSERT INTO inventory (product_id, location, quantity_in_stock, reserved_quantity, available_quantity, reorder_point, last_stock_count, created_at, updated_at) VALUES
(1, 'warehouse', 200, 0, 200, 50, NOW(), NOW(), NOW()),
(1, 'shelf', 30, 0, 30, 10, NOW(), NOW(), NOW()),
(2, 'warehouse', 80, 0, 80, 30, NOW(), NOW(), NOW()),
(2, 'shelf', 15, 0, 15, 5, NOW(), NOW(), NOW()),
(3, 'warehouse', 500, 0, 500, 100, NOW(), NOW(), NOW()),
(3, 'shelf', 50, 0, 50, 20, NOW(), NOW(), NOW()),
(4, 'warehouse', 150, 0, 150, 40, NOW(), NOW(), NOW()),
(4, 'shelf', 25, 0, 25, 10, NOW(), NOW(), NOW()),
(5, 'warehouse', 60, 0, 60, 20, NOW(), NOW(), NOW()),
(5, 'shelf', 8, 0, 8, 5, NOW(), NOW(), NOW()),
(6, 'warehouse', 100, 0, 100, 25, NOW(), NOW(), NOW()),
(6, 'shelf', 15, 0, 15, 8, NOW(), NOW(), NOW());

-- Verify data insertion
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as suppliers_count FROM suppliers;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as inventory_count FROM inventory;

-- View sample data
SELECT p.name, p.sku, c.name as category, s.name as supplier, p.selling_price 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id 
LEFT JOIN suppliers s ON p.supplier_id = s.id;

EXIT;
```

**Using API (Alternative method):**
```bash
# Create a category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Grains & Rice", "description": "Various types of grains and rice products"}'

# Create a supplier
curl -X POST http://localhost:8080/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Farm Fresh Co.",
    "contactPerson": "John Smith",
    "email": "contact@farmfresh.com",
    "phone": "+91-9876543210",
    "address": "123 Farm Street",
    "city": "Chandigarh",
    "state": "Punjab",
    "pincode": "160001"
  }'

# Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Basmati Rice",
    "description": "Long grain premium basmati rice",
    "sku": "RICE001",
    "unit": "kg",
    "purchasePrice": 400.00,
    "sellingPrice": 450.00,
    "mrp": 500.00,
    "gstRate": 5.00,
    "hsnCode": "1006",
    "minStockLevel": 50,
    "maxStockLevel": 500
  }'
```

## ✅ Testing Your Setup

### 1. Test Backend APIs

```bash
# Get dashboard stats
curl http://localhost:8080/api/dashboard/stats

# Get all categories
curl http://localhost:8080/api/categories

# Get all suppliers
curl http://localhost:8080/api/suppliers

# Get all products
curl http://localhost:8080/api/products
```

### 2. Test Frontend

1. **Open browser:** http://localhost:3000
2. **Navigation test:** Click through all menu items
3. **Dashboard:** Verify charts and statistics load
4. **Products page:** Check if sample products appear
5. **Responsive test:** Resize browser window

### 3. Test Database Connection

```bash
# Check if tables were created
mysql -u root -p -e "USE emart_inventory; SHOW TABLES;"

# Check sample data
mysql -u root -p -e "USE emart_inventory; SELECT COUNT(*) FROM products;"
```

## 🚨 Common Issues and Solutions

### Issue 1: MySQL Connection Failed
**Error:** `Connection refused` or `Access denied`

**Solution:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Reset root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
FLUSH PRIVILEGES;
EXIT;
```

### Issue 2: Port Already in Use
**Error:** `Port 8080 already in use`

**Solution:**
```bash
# Find process using port
sudo lsof -i :8080

# Kill the process
sudo kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Issue 3: Node.js/npm Issues
**Error:** Package installation fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: Backend Build Fails
**Error:** Maven compilation errors

**Solution:**
```bash
# Clean Maven cache
./mvnw clean

# Force refresh dependencies
./mvnw dependency:resolve

# Compile with debug info
./mvnw clean compile -X
```

### Issue 5: Frontend Build Fails
**Error:** TypeScript or Vite errors

**Solution:**
```bash
# Check Node.js version (should be 18+)
node --version

# Update packages
npm update

# Build with verbose logging
npm run build --verbose
```

## 🎯 Post-Setup Tasks

### 1. Create Your First Product
1. Open http://localhost:3000/products
2. Click "Add Product"
3. Fill in the form and save

### 2. Test CSV Import
1. Create a CSV file with product data
2. Use the import feature in the Products page

### 3. Monitor Logs
```bash
# Backend logs
tail -f logs/spring.log

# Frontend logs
# Check browser console
```

### 4. Database Backup
```bash
# Create backup
mysqldump -u root -p emart_inventory > emart_backup.sql

# Restore backup
mysql -u root -p emart_inventory < emart_backup.sql
```

## 🔐 Security Considerations

### Production Setup
1. **Change default passwords**
2. **Enable SSL/HTTPS**
3. **Configure firewall rules**
4. **Set up proper authentication**
5. **Regular database backups**

### Development Security
1. **Never commit passwords to git**
2. **Use environment variables**
3. **Keep dependencies updated**

## 📈 Performance Optimization

### Database
```sql
-- Add indexes for better performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
```

### Frontend
```bash
# Build optimized version
npm run build

# Analyze bundle size
npm run build -- --analyze
```

---

**🎉 Congratulations! Your eMart 5 Star system is now ready!**

For additional support, refer to the main README.md or contact the development team.