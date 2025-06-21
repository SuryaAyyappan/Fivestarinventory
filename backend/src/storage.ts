import { eq, and, like, desc, asc, count, sql, gte, lte } from 'drizzle-orm';
import { db } from './db.js';
import {
  users,
  categories,
  suppliers,
  products,
  inventory,
  invoices,
  invoiceItems,
  alerts,
  stockMovements,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Supplier,
  type InsertSupplier,
  type Product,
  type InsertProduct,
  type Inventory,
  type InsertInventory,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem,
  type Alert,
  type InsertAlert,
  type StockMovement,
  type InsertStockMovement,
} from './schema.js';

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
    const [user] = await db.insert(users).values(userData).$returningId();
    return (await this.getUser(user.id))!;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    await db.update(users).set(userData).where(eq(users.id, id));
    return (await this.getUser(id))!;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).$returningId();
    return (await db.select().from(categories).where(eq(categories.id, category.id)))[0];
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true)).orderBy(asc(suppliers.name));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(supplierData).$returningId();
    return (await this.getSupplier(supplier.id))!;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier> {
    await db.update(suppliers).set(supplierData).where(eq(suppliers.id, id));
    return (await this.getSupplier(id))!;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.update(suppliers).set({ isActive: false }).where(eq(suppliers.id, id));
  }

  async getProducts(page = 1, limit = 20, search?: string, categoryId?: number): Promise<{ products: Product[], total: number }> {
    const offset = (page - 1) * limit;
    let query = db.select().from(products).where(eq(products.isActive, true));
    let countQuery = db.select({ count: count() }).from(products).where(eq(products.isActive, true));

    if (search) {
      const searchCondition = like(products.name, `%${search}%`);
      query = query.where(and(eq(products.isActive, true), searchCondition));
      countQuery = countQuery.where(and(eq(products.isActive, true), searchCondition));
    }

    if (categoryId) {
      const categoryCondition = eq(products.categoryId, categoryId);
      query = query.where(and(eq(products.isActive, true), categoryCondition));
      countQuery = countQuery.where(and(eq(products.isActive, true), categoryCondition));
    }

    const [productsResult, totalResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(products.createdAt)),
      countQuery
    ]);

    return {
      products: productsResult,
      total: totalResult[0].count
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
    const [product] = await db.insert(products).values(productData).$returningId();
    return (await this.getProduct(product.id))!;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    await db.update(products).set(productData).where(eq(products.id, id));
    return (await this.getProduct(id))!;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async getInventory(productId?: number, location?: string): Promise<Inventory[]> {
    let query = db.select().from(inventory);
    
    const conditions = [];
    if (productId) conditions.push(eq(inventory.productId, productId));
    if (location) conditions.push(eq(inventory.location, location));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(inventory.updatedAt));
  }

  async getInventoryByProduct(productId: number): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.productId, productId));
  }

  async updateInventory(id: number, inventoryData: Partial<InsertInventory>): Promise<Inventory> {
    await db.update(inventory).set(inventoryData).where(eq(inventory.id, id));
    const [updated] = await db.select().from(inventory).where(eq(inventory.id, id));
    return updated;
  }

  async createInventoryEntry(inventoryData: InsertInventory): Promise<Inventory> {
    const [inventoryEntry] = await db.insert(inventory).values(inventoryData).$returningId();
    const [created] = await db.select().from(inventory).where(eq(inventory.id, inventoryEntry.id));
    return created;
  }

  async transferStock(productId: number, fromLocation: string, toLocation: string, quantity: number, userId: number): Promise<void> {
    // This should be a transaction, but simplified for now
    const [fromInventory] = await db.select().from(inventory)
      .where(and(eq(inventory.productId, productId), eq(inventory.location, fromLocation)));
    
    const [toInventory] = await db.select().from(inventory)
      .where(and(eq(inventory.productId, productId), eq(inventory.location, toLocation)));

    if (fromInventory && fromInventory.quantityInStock >= quantity) {
      await db.update(inventory)
        .set({ 
          quantityInStock: fromInventory.quantityInStock - quantity,
          availableQuantity: (fromInventory.availableQuantity || 0) - quantity
        })
        .where(eq(inventory.id, fromInventory.id));

      if (toInventory) {
        await db.update(inventory)
          .set({ 
            quantityInStock: toInventory.quantityInStock + quantity,
            availableQuantity: (toInventory.availableQuantity || 0) + quantity
          })
          .where(eq(inventory.id, toInventory.id));
      } else {
        await this.createInventoryEntry({
          productId,
          location: toLocation,
          quantityInStock: quantity,
          availableQuantity: quantity,
          updatedBy: userId
        });
      }

      // Record stock movement
      await this.createStockMovement({
        productId,
        movementType: 'transfer',
        quantity,
        fromLocation,
        toLocation,
        createdBy: userId
      });
    }
  }

  async getInvoices(page = 1, limit = 20, supplierId?: number, status?: string): Promise<{ invoices: Invoice[], total: number }> {
    const offset = (page - 1) * limit;
    let query = db.select().from(invoices);
    let countQuery = db.select({ count: count() }).from(invoices);

    const conditions = [];
    if (supplierId) conditions.push(eq(invoices.supplierId, supplierId));
    if (status) conditions.push(eq(invoices.status, status as any));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    const [invoicesResult, totalResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(invoices.createdAt)),
      countQuery
    ]);

    return {
      invoices: invoicesResult,
      total: totalResult[0].count
    };
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(invoiceData).$returningId();
    return (await this.getInvoice(invoice.id))!;
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    await db.update(invoices).set(invoiceData).where(eq(invoices.id, id));
    return (await this.getInvoice(id))!;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  }

  async createInvoiceItem(itemData: InsertInvoiceItem): Promise<InvoiceItem> {
    const [item] = await db.insert(invoiceItems).values(itemData).$returningId();
    const [created] = await db.select().from(invoiceItems).where(eq(invoiceItems.id, item.id));
    return created;
  }

  async getAlerts(isRead?: boolean, isResolved?: boolean): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    const conditions = [];
    if (typeof isRead === 'boolean') conditions.push(eq(alerts.isRead, isRead));
    if (typeof isResolved === 'boolean') conditions.push(eq(alerts.isResolved, isResolved));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(alertData).$returningId();
    const [created] = await db.select().from(alerts).where(eq(alerts.id, alert.id));
    return created;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  async markAlertAsResolved(id: number, userId: number): Promise<void> {
    await db.update(alerts).set({ 
      isResolved: true, 
      resolvedAt: new Date(), 
      resolvedBy: userId 
    }).where(eq(alerts.id, id));
  }

  async createStockMovement(movementData: InsertStockMovement): Promise<StockMovement> {
    const [movement] = await db.insert(stockMovements).values(movementData).$returningId();
    const [created] = await db.select().from(stockMovements).where(eq(stockMovements.id, movement.id));
    return created;
  }

  async getStockMovements(productId?: number, limit = 50): Promise<StockMovement[]> {
    let query = db.select().from(stockMovements);
    
    if (productId) {
      query = query.where(eq(stockMovements.productId, productId));
    }
    
    return await query.limit(limit).orderBy(desc(stockMovements.createdAt));
  }

  async getDashboardStats(): Promise<any> {
    const [productCount] = await db.select({ count: count() }).from(products).where(eq(products.isActive, true));
    const [supplierCount] = await db.select({ count: count() }).from(suppliers).where(eq(suppliers.isActive, true));
    const [totalStockValue] = await db.select({ 
      value: sql<number>`SUM(${products.sellingPrice} * ${inventory.quantityInStock})`
    }).from(products).innerJoin(inventory, eq(products.id, inventory.productId));
    
    const lowStockProducts = await this.getLowStockProducts();

    return {
      totalProducts: productCount.count,
      totalSuppliers: supplierCount.count,
      totalStockValue: totalStockValue.value || 0,
      lowStockAlerts: lowStockProducts.length,
    };
  }

  async getLowStockProducts(): Promise<any[]> {
    return await db.select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      currentStock: inventory.quantityInStock,
      minStock: products.minStockLevel
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(products.isActive, true),
        sql`${inventory.quantityInStock} <= ${products.minStockLevel}`
      )
    );
  }

  async getExpiringProducts(days: number): Promise<any[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      expiryDate: products.expiryDate,
      currentStock: inventory.quantityInStock
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(products.isActive, true),
        lte(products.expiryDate, futureDate)
      )
    );
  }

  async getTopSellingProducts(limit: number): Promise<any[]> {
    // This would require sales data, returning empty for now
    return [];
  }
}

export const storage = new DatabaseStorage();