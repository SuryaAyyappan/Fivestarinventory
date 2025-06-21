import express, { type Express, type Request, type Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import createCsvWriter from 'csv-writer';
import fs from 'fs';
import path from 'path';
import { storage } from './storage.js';
import {
  insertUserSchema,
  insertCategorySchema,
  insertSupplierSchema,
  insertProductSchema,
  insertInventorySchema,
  insertInvoiceSchema,
  insertInvoiceItemSchema,
  insertAlertSchema,
  insertStockMovementSchema,
} from './schema.js';
import { z } from 'zod';

const upload = multer({ dest: 'uploads/' });

export function setupRoutes(app: Express) {
  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // User routes
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Category routes
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  // Supplier routes
  app.get('/api/suppliers', async (req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
  });

  app.get('/api/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supplier' });
    }
  });

  app.post('/api/suppliers', async (req: Request, res: Response) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create supplier' });
    }
  });

  app.put('/api/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const supplierData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, supplierData);
      res.json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update supplier' });
    }
  });

  app.delete('/api/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSupplier(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete supplier' });
    }
  });

  // Product routes
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      const result = await storage.getProducts(page, limit, search, categoryId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // CSV Import/Export for Products
  app.post('/api/products/import', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const results: any[] = [];
      const errors: string[] = [];
      
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let imported = 0;
          
          for (const row of results) {
            try {
              const productData = {
                name: row.name,
                description: row.description,
                sku: row.sku,
                barcode: row.barcode,
                categoryId: row.categoryId ? parseInt(row.categoryId) : null,
                supplierId: row.supplierId ? parseInt(row.supplierId) : null,
                unit: row.unit || 'pcs',
                purchasePrice: row.purchasePrice || '0.00',
                sellingPrice: row.sellingPrice || '0.00',
                mrp: row.mrp || '0.00',
                gstRate: row.gstRate || '0.00',
                hsnCode: row.hsnCode,
                minStockLevel: row.minStockLevel ? parseInt(row.minStockLevel) : 0,
                maxStockLevel: row.maxStockLevel ? parseInt(row.maxStockLevel) : 1000,
              };

              const validatedData = insertProductSchema.parse(productData);
              await storage.createProduct(validatedData);
              imported++;
            } catch (error) {
              errors.push(`Row ${imported + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file!.path);

          res.json({
            message: `Import completed. ${imported} products imported.`,
            imported,
            errors: errors.length > 0 ? errors : undefined
          });
        });
    } catch (error) {
      res.status(500).json({ error: 'Failed to import products' });
    }
  });

  app.get('/api/products/export', async (req: Request, res: Response) => {
    try {
      const { products } = await storage.getProducts(1, 10000); // Export all products
      
      const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: 'exports/products.csv',
        header: [
          { id: 'id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'description', title: 'Description' },
          { id: 'sku', title: 'SKU' },
          { id: 'barcode', title: 'Barcode' },
          { id: 'categoryId', title: 'Category ID' },
          { id: 'supplierId', title: 'Supplier ID' },
          { id: 'unit', title: 'Unit' },
          { id: 'purchasePrice', title: 'Purchase Price' },
          { id: 'sellingPrice', title: 'Selling Price' },
          { id: 'mrp', title: 'MRP' },
          { id: 'gstRate', title: 'GST Rate' },
          { id: 'hsnCode', title: 'HSN Code' },
          { id: 'minStockLevel', title: 'Min Stock Level' },
          { id: 'maxStockLevel', title: 'Max Stock Level' },
        ]
      });

      // Ensure exports directory exists
      if (!fs.existsSync('exports')) {
        fs.mkdirSync('exports');
      }

      await csvWriter.writeRecords(products);
      
      res.download('exports/products.csv', 'products.csv', (err) => {
        if (!err) {
          // Clean up file after download
          fs.unlinkSync('exports/products.csv');
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to export products' });
    }
  });

  // Inventory routes
  app.get('/api/inventory', async (req: Request, res: Response) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const location = req.query.location as string;
      
      const inventory = await storage.getInventory(productId, location);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.get('/api/inventory/product/:productId', async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const inventory = await storage.getInventoryByProduct(productId);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product inventory' });
    }
  });

  app.put('/api/inventory/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const inventoryData = insertInventorySchema.partial().parse(req.body);
      const inventory = await storage.updateInventory(id, inventoryData);
      res.json(inventory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  });

  app.post('/api/inventory/transfer', async (req: Request, res: Response) => {
    try {
      const { productId, fromLocation, toLocation, quantity, userId } = req.body;
      await storage.transferStock(productId, fromLocation, toLocation, quantity, userId);
      res.json({ message: 'Stock transferred successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to transfer stock' });
    }
  });

  // Invoice routes
  app.get('/api/invoices', async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const supplierId = req.query.supplierId ? parseInt(req.query.supplierId as string) : undefined;
      const status = req.query.status as string;
      
      const result = await storage.getInvoices(page, limit, supplierId, status);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  app.get('/api/invoices/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoice' });
    }
  });

  app.post('/api/invoices', async (req: Request, res: Response) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  });

  app.put('/api/invoices/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(id, invoiceData);
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  });

  // Alert routes
  app.get('/api/alerts', async (req: Request, res: Response) => {
    try {
      const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
      const isResolved = req.query.isResolved === 'true' ? true : req.query.isResolved === 'false' ? false : undefined;
      
      const alerts = await storage.getAlerts(isRead, isResolved);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  app.post('/api/alerts', async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });

  app.patch('/api/alerts/:id/read', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markAlertAsRead(id);
      res.json({ message: 'Alert marked as read' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark alert as read' });
    }
  });

  app.patch('/api/alerts/:id/resolve', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      await storage.markAlertAsResolved(id, userId);
      res.json({ message: 'Alert resolved' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  // Stock movement routes
  app.get('/api/stock-movements', async (req: Request, res: Response) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const movements = await storage.getStockMovements(productId, limit);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stock movements' });
    }
  });

  // Dashboard analytics
  app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/dashboard/low-stock', async (req: Request, res: Response) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
  });

  app.get('/api/dashboard/expiring', async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const products = await storage.getExpiringProducts(days);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expiring products' });
    }
  });

  app.get('/api/dashboard/top-selling', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await storage.getTopSellingProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch top selling products' });
    }
  });
}