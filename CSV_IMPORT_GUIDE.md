# CSV Import Feature Guide

## Overview
The CSV Import feature allows Makers to upload product data in bulk through CSV files, which are then reviewed and approved by Checkers before being added to the product catalog.

## Workflow

### 1. Maker Upload Process
1. **Download Template**: Makers can download a CSV template with the correct format
2. **Prepare CSV**: Fill in the template with product data
3. **Upload CSV**: Upload the file through the web interface
4. **Validation**: System validates the data and shows any errors
5. **Pending Review**: File is marked as pending for checker review

### 2. Checker Review Process
1. **View Pending Imports**: Checkers can see all pending CSV imports
2. **Review Details**: View individual items in each import
3. **Approve/Reject**: Approve valid imports or reject with reasons
4. **Product Creation**: Approved items are automatically created as products

## CSV Format

### Required Columns
The CSV file must have the following columns in order:

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| name | String | Yes | Product name | "Laptop Dell Inspiron 15" |
| description | String | No | Product description | "High-performance laptop" |
| sku | String | Yes | Unique SKU code | "DELL001" |
| barcode | String | No | Product barcode | "8901234567890" |
| categoryName | String | No | Category name | "Electronics" |
| supplierName | String | No | Supplier name | "Dell India" |
| unit | String | No | Unit of measurement | "pcs" |
| purchasePrice | Decimal | No | Purchase price | "45000.00" |
| mrp | Decimal | No | Maximum retail price | "55000.00" |
| minStockLevel | Integer | No | Minimum stock level | "5" |
| maxStockLevel | Integer | No | Maximum stock level | "50" |
| expiryDate | Date | No | Expiry date (YYYY-MM-DD) | "2025-12-31" |
| manufacturerDate | Date | No | Manufacturing date (YYYY-MM-DD) | "2024-01-15" |
| batchNumber | String | No | Batch number | "BATCH001" |
| manufacturerCode | String | Yes | 5-digit manufacturer code | "12345" |

### Sample CSV
```csv
name,description,sku,barcode,categoryName,supplierName,unit,purchasePrice,mrp,minStockLevel,maxStockLevel,expiryDate,manufacturerDate,batchNumber,manufacturerCode
Laptop Dell Inspiron 15,High-performance laptop for business and gaming,DELL001,8901234567890,Electronics,Dell India,pcs,45000.00,55000.00,5,50,2025-12-31,2024-01-15,BATCH001,12345
iPhone 15 Pro,Latest smartphone with advanced features,APPLE001,8902345678901,Electronics,Apple India,pcs,75000.00,85000.00,10,100,2026-06-30,2024-02-01,BATCH002,23456
```

## Validation Rules

### Required Fields
- **name**: Must not be empty
- **sku**: Must be unique (not already exists in system)
- **manufacturerCode**: Must be exactly 5 digits

### Data Validation
- **Dates**: Must be in YYYY-MM-DD format
- **Numbers**: Purchase price, MRP, stock levels must be valid numbers
- **SKU Uniqueness**: SKU must not already exist in the system
- **Manufacturer Code**: Must be exactly 5 digits

## API Endpoints

### Upload CSV (Maker Only)
```
POST /api/csv-import/upload
Headers: 
  - role: MAKER
  - username: [username]
Body: FormData with CSV file
```

### Get Pending Imports (Checker/Admin)
```
GET /api/csv-import/pending?page=0&size=10
Headers:
  - role: CHECKER or ADMIN
```

### Get Import Items (Checker/Admin)
```
GET /api/csv-import/{importId}/items
Headers:
  - role: CHECKER or ADMIN
```

### Approve Import (Checker Only)
```
POST /api/csv-import/{importId}/approve
Headers:
  - role: CHECKER
  - username: [username]
```

### Reject Import (Checker Only)
```
POST /api/csv-import/{importId}/reject
Headers:
  - role: CHECKER
  - username: [username]
Body: { "reason": "Rejection reason" }
```

### Download Template (Maker Only)
```
GET /api/csv-import/template
Headers:
  - role: MAKER
```

## Database Schema

### CSV Import Table
```sql
CREATE TABLE csv_imports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255),
    uploaded_by VARCHAR(255),
    total_records INT,
    valid_records INT,
    invalid_records INT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    error_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### CSV Import Items Table
```sql
CREATE TABLE csv_import_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    csv_import_id BIGINT,
    name VARCHAR(255),
    description TEXT,
    sku VARCHAR(255),
    barcode VARCHAR(255),
    category_name VARCHAR(255),
    supplier_name VARCHAR(255),
    unit VARCHAR(50),
    purchase_price DECIMAL(10,2),
    mrp DECIMAL(10,2),
    min_stock_level INT,
    max_stock_level INT,
    expiry_date VARCHAR(50),
    manufacturer_date VARCHAR(50),
    batch_number VARCHAR(255),
    manufacturer_code VARCHAR(10),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (csv_import_id) REFERENCES csv_imports(id)
);
```

## Error Handling

### Common Validation Errors
1. **Missing Required Fields**: Name, SKU, or manufacturer code missing
2. **Duplicate SKU**: SKU already exists in the system
3. **Invalid Manufacturer Code**: Not exactly 5 digits
4. **Invalid Date Format**: Dates not in YYYY-MM-DD format
5. **Invalid Numbers**: Non-numeric values in numeric fields

### Error Response Format
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Row 2: Product name is required",
    "Row 3: SKU already exists: DELL001",
    "Row 4: Manufacturer code must be exactly 5 digits"
  ]
}
```

## Frontend Features

### Maker Interface
- Download CSV template button
- File upload with drag-and-drop
- Real-time validation feedback
- Upload progress indicator
- Success/error notifications

### Checker Interface
- List of pending imports
- Import details view
- Individual item review
- Approve/reject actions
- Rejection reason input

### Admin Interface
- View all imports (read-only)
- Import history
- Statistics and reports

## Security Features

### Role-Based Access
- **MAKER**: Can upload CSV files and download templates
- **CHECKER**: Can review, approve, and reject imports
- **ADMIN**: Can view all imports (read-only)

### Data Validation
- Server-side validation for all data
- SQL injection prevention
- File type validation (CSV only)
- File size limits

### Audit Trail
- All actions logged with user and timestamp
- Import history maintained
- Error details preserved

## Best Practices

### For Makers
1. Always use the provided template
2. Validate data before uploading
3. Keep manufacturer codes unique
4. Use consistent date formats
5. Test with small files first

### For Checkers
1. Review all items carefully
2. Check for data quality issues
3. Provide clear rejection reasons
4. Verify category and supplier names
5. Monitor import statistics

### For System Administrators
1. Monitor import volumes
2. Review error patterns
3. Update validation rules as needed
4. Backup import data regularly
5. Train users on proper usage

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check file format and size
2. **Validation Errors**: Review error messages and fix data
3. **Approval Fails**: Check database connectivity
4. **Template Download Fails**: Verify user permissions

### Support
For technical issues, contact the system administrator with:
- Error messages
- CSV file sample (if applicable)
- User role and actions performed
- Timestamp of the issue 