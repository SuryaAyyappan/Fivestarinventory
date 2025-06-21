import {
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  int,
  timestamp,
  boolean,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  role: mysqlEnum('role', ['admin', 'manager', 'staff']).default('staff'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Categories table
export const categories = mysqlTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Suppliers table
export const suppliers = mysqlTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  contactPerson: varchar('contact_person', { length: 100 }),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 50 }),
  state: varchar('state', { length: 50 }),
  pincode: varchar('pincode', { length: 10 }),
  gstNumber: varchar('gst_number', { length: 15 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Products table
export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  barcode: varchar('barcode', { length: 50 }),
  categoryId: int('category_id').references(() => categories.id),
  supplierId: int('supplier_id').references(() => suppliers.id),
  unit: varchar('unit', { length: 20 }).default('pcs'),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).default('0.00'),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).default('0.00'),
  mrp: decimal('mrp', { precision: 10, scale: 2 }).default('0.00'),
  gstRate: decimal('gst_rate', { precision: 5, scale: 2 }).default('0.00'),
  hsnCode: varchar('hsn_code', { length: 10 }),
  minStockLevel: int('min_stock_level').default(0),
  maxStockLevel: int('max_stock_level').default(1000),
  expiryDate: timestamp('expiry_date'),
  batchNumber: varchar('batch_number', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Inventory table
export const inventory = mysqlTable('inventory', {
  id: serial('id').primaryKey(),
  productId: int('product_id').notNull().references(() => products.id),
  location: varchar('location', { length: 50 }).default('warehouse'),
  quantityInStock: int('quantity_in_stock').default(0),
  reservedQuantity: int('reserved_quantity').default(0),
  availableQuantity: int('available_quantity').default(0),
  reorderPoint: int('reorder_point').default(0),
  lastStockCount: timestamp('last_stock_count'),
  updatedBy: int('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Invoices table
export const invoices = mysqlTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  supplierId: int('supplier_id').notNull().references(() => suppliers.id),
  invoiceDate: timestamp('invoice_date').defaultNow(),
  dueDate: timestamp('due_date'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).default('0.00'),
  gstAmount: decimal('gst_amount', { precision: 10, scale: 2 }).default('0.00'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).default('0.00'),
  paidAmount: decimal('paid_amount', { precision: 10, scale: 2 }).default('0.00'),
  balanceAmount: decimal('balance_amount', { precision: 10, scale: 2 }).default('0.00'),
  status: mysqlEnum('status', ['pending', 'partial', 'paid', 'overdue']).default('pending'),
  notes: text('notes'),
  createdBy: int('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Invoice Items table
export const invoiceItems = mysqlTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: int('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  productId: int('product_id').notNull().references(() => products.id),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  gstRate: decimal('gst_rate', { precision: 5, scale: 2 }).default('0.00'),
  gstAmount: decimal('gst_amount', { precision: 10, scale: 2 }).default('0.00'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Alerts table
export const alerts = mysqlTable('alerts', {
  id: serial('id').primaryKey(),
  type: mysqlEnum('type', ['low_stock', 'expiry_warning', 'overdue_payment', 'system']).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  severity: mysqlEnum('severity', ['low', 'medium', 'high', 'critical']).default('medium'),
  isRead: boolean('is_read').default(false),
  isResolved: boolean('is_resolved').default(false),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: int('entity_id'),
  metadata: json('metadata'),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: int('resolved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stock Movements table
export const stockMovements = mysqlTable('stock_movements', {
  id: serial('id').primaryKey(),
  productId: int('product_id').notNull().references(() => products.id),
  movementType: mysqlEnum('movement_type', ['in', 'out', 'transfer', 'adjustment']).notNull(),
  quantity: int('quantity').notNull(),
  fromLocation: varchar('from_location', { length: 50 }),
  toLocation: varchar('to_location', { length: 50 }),
  reference: varchar('reference', { length: 100 }),
  referenceId: int('reference_id'),
  notes: text('notes'),
  createdBy: int('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  invoices: many(invoices),
  stockMovements: many(stockMovements),
  resolvedAlerts: many(alerts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  invoices: many(invoices),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  inventory: many(inventory),
  invoiceItems: many(invoiceItems),
  stockMovements: many(stockMovements),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  updatedByUser: one(users, {
    fields: [inventory.updatedBy],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [invoices.supplierId],
    references: [suppliers.id],
  }),
  createdByUser: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  resolvedByUser: one(users, {
    fields: [alerts.resolvedBy],
    references: [users.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  createdByUser: one(users, {
    fields: [stockMovements.createdBy],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;