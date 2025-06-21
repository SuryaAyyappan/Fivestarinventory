import {
  users, categories, suppliers, products, inventory, invoices, invoiceItems,
  alerts, stockMovements,
  type User, type InsertUser, type Category, type InsertCategory,
  type Supplier, type InsertSupplier, type Product, type InsertProduct,
  type Inventory, type InsertInventory, type Invoice, type InsertInvoice,
  type InvoiceItem, type InsertInvoiceItem, type Alert, type InsertAlert,
  type StockMovement, type InsertStockMovement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, and, or, like, count, sum } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: number): Promise<void>;
  
  // Product operations
  getProducts(page?: number, limit?: number, search?: string, categoryId?: number): Promise<{ products: Product[], total: number }>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Inventory operations
  getInventory(productId?: number, location?: string): Promise<Inventory[]>;
  getInventoryByProduct(productId: number): Promise<Inventory[]>;
  updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory>;
  createInventoryEntry(inventory: InsertInventory): Promise<Inventory>;
  transferStock(productId: number, fromLocation: string, toLocation: string, quantity: number, userId: number): Promise<void>;
  
  // Invoice operations
  getInvoices(page?: number, limit?: number, supplierId?: number, status?: string): Promise<{ invoices: Invoice[], total: number }>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
  getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  
  // Alert operations
  getAlerts(isRead?: boolean, isResolved?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<void>;
  markAlertAsResolved(id: number, userId: number): Promise<void>;
  
  // Stock movement operations
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getStockMovements(productId?: number, limit?: number): Promise<StockMovement[]>;
  
  // Analytics operations
  getDashboardStats(): Promise<any>;
  getLowStockProducts(): Promise<any[]>;
  getExpiringProducts(days: number): Promise<any[]>;
  getTopSellingProducts(limit: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true)).orderBy(asc(suppliers.name));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(supplierData).returning();
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier> {
    const [supplier] = await db
      .update(suppliers)
      .set({ ...supplierData, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return supplier;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.update(suppliers).set({ isActive: false }).where(eq(suppliers.id, id));
  }

  async getProducts(page = 1, limit = 20, search?: string, categoryId?: number): Promise<{ products: Product[], total: number }> {
    const offset = (page - 1) * limit;
    let query = db.select().from(products).where(eq(products.isActive, true));
    let countQuery = db.select({ count: count() }).from(products).where(eq(products.isActive, true));

    if (search) {
      const searchCondition = or(
        like(products.name, `%${search}%`),
        like(products.sku, `%${search}%`),
        like(products.description, `%${search}%`)
      );
      query = query.where(searchCondition);
      countQuery = countQuery.where(searchCondition);
    }

    if (categoryId) {
      query = query.where(eq(products.categoryId, categoryId));
      countQuery = countQuery.where(eq(products.categoryId, categoryId));
    }

    const [productsResult, countResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(products.createdAt)),
      countQuery
    ]);

    return {
      products: productsResult,
      total: countResult[0].count as number
    };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    
    // Create initial inventory entries for warehouse and shelf
    await Promise.all([
      db.insert(inventory).values({
        productId: product.id,
        location: 'warehouse',
        quantity: 0
      }),
      db.insert(inventory).values({
        productId: product.id,
        location: 'shelf',
        quantity: 0
      })
    ]);

    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async getInventory(productId?: number, location?: string): Promise<Inventory[]> {
    let query = db.select().from(inventory);
    
    if (productId && location) {
      query = query.where(and(eq(inventory.productId, productId), eq(inventory.location, location)));
    } else if (productId) {
      query = query.where(eq(inventory.productId, productId));
    } else if (location) {
      query = query.where(eq(inventory.location, location));
    }

    return await query.orderBy(asc(inventory.productId));
  }

  async getInventoryByProduct(productId: number): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.productId, productId));
  }

  async updateInventory(id: number, inventoryData: Partial<InsertInventory>): Promise<Inventory> {
    const [inventoryItem] = await db
      .update(inventory)
      .set({ ...inventoryData, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return inventoryItem;
  }

  async createInventoryEntry(inventoryData: InsertInventory): Promise<Inventory> {
    const [inventoryItem] = await db.insert(inventory).values(inventoryData).returning();
    return inventoryItem;
  }

  async transferStock(productId: number, fromLocation: string, toLocation: string, quantity: number, userId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Decrease from source location
      await tx
        .update(inventory)
        .set({ 
          quantity: sql`quantity - ${quantity}`,
          lastUpdated: new Date(),
          updatedBy: userId
        })
        .where(and(eq(inventory.productId, productId), eq(inventory.location, fromLocation)));

      // Increase in destination location
      await tx
        .update(inventory)
        .set({ 
          quantity: sql`quantity + ${quantity}`,
          lastUpdated: new Date(),
          updatedBy: userId
        })
        .where(and(eq(inventory.productId, productId), eq(inventory.location, toLocation)));

      // Record stock movement
      await tx.insert(stockMovements).values({
        productId,
        movementType: 'transfer',
        fromLocation,
        toLocation,
        quantity,
        reason: 'Stock transfer',
        createdBy: userId
      });
    });
  }

  async getInvoices(page = 1, limit = 20, supplierId?: number, status?: string): Promise<{ invoices: Invoice[], total: number }> {
    const offset = (page - 1) * limit;
    let query = db.select().from(invoices);
    let countQuery = db.select({ count: count() }).from(invoices);

    const conditions = [];
    if (supplierId) {
      conditions.push(eq(invoices.supplierId, supplierId));
    }
    if (status) {
      conditions.push(eq(invoices.status, status));
    }

    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
      countQuery = countQuery.where(whereCondition);
    }

    const [invoicesResult, countResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(invoices.createdAt)),
      countQuery
    ]);

    return {
      invoices: invoicesResult,
      total: countResult[0].count as number
    };
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(invoiceData).returning();
    return invoice;
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set({ ...invoiceData, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  }

  async createInvoiceItem(itemData: InsertInvoiceItem): Promise<InvoiceItem> {
    const [item] = await db.insert(invoiceItems).values(itemData).returning();
    return item;
  }

  async getAlerts(isRead?: boolean, isResolved?: boolean): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    const conditions = [];
    if (isRead !== undefined) {
      conditions.push(eq(alerts.isRead, isRead));
    }
    if (isResolved !== undefined) {
      conditions.push(eq(alerts.isResolved, isResolved));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(alertData).returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  async markAlertAsResolved(id: number, userId: number): Promise<void> {
    await db
      .update(alerts)
      .set({ 
        isResolved: true, 
        resolvedAt: new Date(),
        resolvedBy: userId
      })
      .where(eq(alerts.id, id));
  }

  async createStockMovement(movementData: InsertStockMovement): Promise<StockMovement> {
    const [movement] = await db.insert(stockMovements).values(movementData).returning();
    return movement;
  }

  async getStockMovements(productId?: number, limit = 50): Promise<StockMovement[]> {
    let query = db.select().from(stockMovements);
    
    if (productId) {
      query = query.where(eq(stockMovements.productId, productId));
    }

    return await query.limit(limit).orderBy(desc(stockMovements.movementDate));
  }

  async getDashboardStats(): Promise<any> {
    const [
      totalProducts,
      totalStockValue,
      lowStockCount,
      activeSuppliers,
      totalInvoices,
      pendingPayments,
      overduePayments,
      unreadAlerts
    ] = await Promise.all([
      db.select({ count: count() }).from(products).where(eq(products.isActive, true)),
      db.select({ 
        value: sql<number>`COALESCE(SUM(${products.sellingPrice}::numeric * ${inventory.quantity}), 0)`
      }).from(products)
        .leftJoin(inventory, eq(products.id, inventory.productId)),
      db.select({ count: count() }).from(products)
        .leftJoin(inventory, eq(products.id, inventory.productId))
        .where(and(
          eq(products.isActive, true),
          sql`${inventory.quantity} <= ${products.minStockLevel}`
        )),
      db.select({ count: count() }).from(suppliers).where(eq(suppliers.isActive, true)),
      db.select({ count: count() }).from(invoices),
      db.select({ 
        amount: sql<number>`COALESCE(SUM(${invoices.totalAmount}::numeric), 0)`
      }).from(invoices).where(eq(invoices.status, 'pending')),
      db.select({ 
        amount: sql<number>`COALESCE(SUM(${invoices.totalAmount}::numeric), 0)`
      }).from(invoices).where(eq(invoices.status, 'overdue')),
      db.select({ count: count() }).from(alerts).where(eq(alerts.isRead, false))
    ]);

    return {
      totalProducts: totalProducts[0].count,
      totalStockValue: totalStockValue[0].value || 0,
      lowStockCount: lowStockCount[0].count,
      activeSuppliers: activeSuppliers[0].count,
      totalInvoices: totalInvoices[0].count,
      pendingPayments: pendingPayments[0].amount || 0,
      overduePayments: overduePayments[0].amount || 0,
      unreadAlerts: unreadAlerts[0].count
    };
  }

  async getLowStockProducts(): Promise<any[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        minStockLevel: products.minStockLevel,
        currentStock: inventory.quantity
      })
      .from(products)
      .leftJoin(inventory, eq(products.id, inventory.productId))
      .where(and(
        eq(products.isActive, true),
        sql`${inventory.quantity} <= ${products.minStockLevel}`
      ))
      .orderBy(asc(inventory.quantity));
  }

  async getExpiringProducts(days: number): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        expiryDate: products.expiryDate,
        currentStock: inventory.quantity
      })
      .from(products)
      .leftJoin(inventory, eq(products.id, inventory.productId))
      .where(and(
        eq(products.isActive, true),
        sql`${products.expiryDate} <= ${targetDate.toISOString()}`
      ))
      .orderBy(asc(products.expiryDate));
  }

  async getTopSellingProducts(limit: number): Promise<any[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        totalSold: sql<number>`COALESCE(SUM(${invoiceItems.quantity}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${invoiceItems.totalPrice}::numeric), 0)`
      })
      .from(products)
      .leftJoin(invoiceItems, eq(products.id, invoiceItems.productId))
      .groupBy(products.id, products.name, products.sku)
      .orderBy(desc(sql`COALESCE(SUM(${invoiceItems.quantity}), 0)`))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
