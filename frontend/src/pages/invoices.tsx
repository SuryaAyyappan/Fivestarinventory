import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileText, DollarSign, Calendar, CheckCircle, Download, Plus, Trash2, Store } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { apiRequest } from '../lib/queryClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

async function downloadSupplierInvoicePDF(invoiceId: number | string) {
  const response = await fetch(`/api/invoices/supplier/${invoiceId}`);
  if (!response.ok) throw new Error('Failed to download PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice_supplier_${invoiceId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Custom Supplier Invoice PDF Download
async function downloadCustomSupplierInvoicePDF(supplierId, items) {
  const response = await fetch('/api/invoices/supplier/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplierId, items }),
  });
  if (!response.ok) throw new Error('Failed to download PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `custom_supplier_invoice.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// New: Download all-products supplier invoice PDF
async function downloadSupplierAllProductsPDF(supplierId) {
  const response = await fetch(`/api/invoices/supplier/generate-pdf/${supplierId}`);
  if (!response.ok) throw new Error('Failed to download PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice_supplier_${supplierId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Outlet Invoice PDF Download
async function downloadOutletInvoicePDF(outletId, items) {
  const response = await fetch('/api/outlet-invoice/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outletId, items }),
  });
  if (!response.ok) throw new Error('Failed to download PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `outlet_invoice_${outletId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Add send email functions
async function sendSupplierInvoiceEmail(invoiceId) {
  const res = await fetch(`/api/invoices/supplier/send-email?invoiceId=${invoiceId}`);
  if (!res.ok) throw new Error('Failed to send email');
  return res.text();
}
async function sendOutletInvoiceEmail(outletId, items) {
  const res = await fetch(`/api/outlet-invoice/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outletId, items }),
  });
  if (!res.ok) throw new Error('Failed to send email');
  return res.text();
}

// Add a function to send all-products supplier invoice email
async function sendSupplierAllProductsEmail(supplierId) {
  const res = await fetch(`/api/invoices/supplier/send-all-products-email?supplierId=${supplierId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to send email');
  return res.text();
}

interface Outlet {
  id: number;
  name: string;
  location: string;
  contactNumber: string;
  managerName: string;
}

export default function Invoices() {
  const { data: invoiceData, isLoading, isError } = useQuery({
    queryKey: ['/api/invoices'],
    queryFn: () => apiRequest('/api/invoices'),
    initialData: [],
  });

  const displayInvoices = (invoiceData && invoiceData.length > 0) ? invoiceData : [];

  // Custom Invoice State
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{ productId: string; quantity: number }[]>([]);
  const [downloading, setDownloading] = useState(false);

  // Fetch suppliers and products
  const { data: suppliers = [] } = useQuery({
    queryKey: ['/api/suppliers'],
    queryFn: () => apiRequest('/api/suppliers'),
    initialData: [],
  });
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products', { role: 'ADMIN' }],
    queryFn: () => apiRequest('/api/products', { headers: { role: 'ADMIN' } }),
    initialData: { products: [] },
  });

  // Add product to selection
  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
  };
  // Remove product from selection
  const removeProduct = (idx) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== idx));
  };
  // Update product or quantity
  const updateProduct = (idx, field, value) => {
    setSelectedProducts(selectedProducts.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  // Download custom invoice
  const handleDownloadCustom = async () => {
    if (!selectedSupplier || selectedProducts.length === 0 || selectedProducts.some(p => !p.productId || !p.quantity)) return;
    setDownloading(true);
    try {
      await downloadCustomSupplierInvoicePDF(selectedSupplier, selectedProducts.map(p => ({ productId: Number(p.productId), quantity: Number(p.quantity) })));
    } catch (e) {
      alert('Failed to download PDF');
    }
    setDownloading(false);
  };

  const [selectedSupplierForAll, setSelectedSupplierForAll] = useState('');
  const [downloadingAll, setDownloadingAll] = useState(false);

  // Outlet Invoice State
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [outletProducts, setOutletProducts] = useState<{ productId: string; quantity: number }[]>([]);
  const [downloadingOutlet, setDownloadingOutlet] = useState(false);
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  React.useEffect(() => {
    fetch('/api/outlets').then(res => res.json()).then(setOutlets);
  }, []);

  // Fetch products for outlet invoice
  const { data: allProducts = { products: [] } } = useQuery({
    queryKey: ['/api/products', { role: 'ADMIN' }],
    queryFn: () => apiRequest('/api/products', { headers: { role: 'ADMIN' } }),
    initialData: { products: [] },
  });

  const addOutletProduct = () => {
    setOutletProducts([...outletProducts, { productId: '', quantity: 1 }]);
  };
  const removeOutletProduct = (idx) => {
    setOutletProducts(outletProducts.filter((_, i) => i !== idx));
  };
  const updateOutletProduct = (idx, field, value) => {
    setOutletProducts(outletProducts.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  // Calculate total price for outlet invoice
  const getOutletProductPrice = (productId, quantity) => {
    const product = allProducts.products.find(p => p.id === Number(productId));
    if (!product || !product.mrp) return 0;
    return Number(product.mrp) * Number(quantity);
  };
  const outletSubtotal = outletProducts.reduce((sum, p) => sum + getOutletProductPrice(p.productId, p.quantity), 0);
  const outletTax = outletSubtotal * 0.18;
  const outletTotal = outletSubtotal + outletTax;

  const [activeTab, setActiveTab] = useState<'supplier' | 'outlet'>('supplier');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#2a180c] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold text-lg border-b-4 transition-all duration-200 ${activeTab === 'supplier' ? 'border-gold-400 bg-[#3b2412] text-gold-400 shadow' : 'border-transparent bg-[#2a180c] text-gold-200'}`}
            onClick={() => setActiveTab('supplier')}
          >
            Supplier Invoice
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold text-lg border-b-4 transition-all duration-200 ${activeTab === 'outlet' ? 'border-gold-400 bg-[#3b2412] text-gold-400 shadow' : 'border-transparent bg-[#2a180c] text-gold-200'}`}
            onClick={() => setActiveTab('outlet')}
          >
            Outlet Invoice
          </button>
        </div>

        {/* Supplier Invoice Section */}
        {activeTab === 'supplier' && (
          <>
            {/* Page Header, Stats, Filters, Table, etc. */}
            {/* New: Supplier All-Products Invoice PDF Generator */}
            <div className="mb-8 p-8 bg-[#3b2412] rounded-xl shadow-lg border border-gold-400 max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-gold-400 mr-2" />
                <h2 className="text-2xl font-bold text-gold-400">Download Supplier Invoice (All Products)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gold-300 font-medium mb-1">Supplier</label>
                  <select
                    className="w-full p-2 rounded border border-gold-400 bg-[#2a180c] text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    value={selectedSupplierForAll}
                    onChange={e => setSelectedSupplierForAll(e.target.value)}
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    type="button"
                    onClick={async () => {
                      setDownloadingAll(true);
                      try {
                        await downloadSupplierAllProductsPDF(selectedSupplierForAll);
                      } catch (e) {
                        alert('Failed to download PDF');
                      }
                      setDownloadingAll(false);
                    }}
                    className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] w-full font-bold shadow"
                    disabled={!selectedSupplierForAll || downloadingAll}
                  >
                    {downloadingAll ? 'Generating PDF...' : (<><Download className="h-4 w-4 mr-2" /> Download Supplier Invoice PDF</>)}
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      setDownloadingAll(true);
                      try {
                        const msg = await sendSupplierAllProductsEmail(selectedSupplierForAll);
                        alert(msg);
                      } catch (e) {
                        alert('Failed to send email');
                      }
                      setDownloadingAll(false);
                    }}
                    className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] w-full font-bold shadow"
                    disabled={!selectedSupplierForAll || downloadingAll}
                  >
                    {downloadingAll ? 'Sending Email...' : (<><FileText className="h-4 w-4 mr-2" /> Send Email</>)}
                  </Button>
                </div>
              </div>
            </div>
            {/* Remove the two cards for Supplier/Outlet Invoice (coming soon) */}
            {/* Remove the brown table header if there are no invoices */}
            {displayInvoices.length > 0 && (
              <table className="min-w-full rounded shadow bg-[#3b2412]">
                <thead className="bg-[#2a180c]">
                  <tr>
                    <th className="p-4 text-left text-gold-400 font-semibold">Invoice #</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Supplier</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Amount</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Status</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Date</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Products</th>
                    <th className="p-4 text-left text-gold-400 font-semibold">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {displayInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="border-b border-gold-700/20 hover:bg-[#4e2e13] transition-colors group"
                    >
                      <td className="p-4 font-medium text-gold-200">{invoice.invoiceNumber || invoice.id}</td>
                      <td className="p-4 text-gold-200">{invoice.supplier?.name || ''}</td>
                      <td className="p-4 text-gold-200">₹{invoice.amount?.toFixed(2) || invoice.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td className="p-4">
                        {invoice.status === 'PAID' ? (
                          <Badge className="bg-green-900/20 text-green-400 border-green-700/30">Paid</Badge>
                        ) : (
                          <Badge className="bg-gold-900/20 text-gold-400 border-gold-700/30">Pending</Badge>
                        )}
                      </td>
                      <td className="p-4 text-gold-200">{new Date(invoice.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-gold-200">
                        <ul>
                          {(invoice.products && invoice.products.length > 0)
                            ? invoice.products.map((product, idx) => (
                                <li key={idx}>{product.name || product}</li>
                              ))
                            : <li>(No product details)</li>
                          }
                        </ul>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] px-3 py-1 rounded flex items-center font-bold shadow"
                          onClick={() => downloadSupplierInvoicePDF(invoice.id)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </button>
                        <button
                          className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] px-3 py-1 rounded flex items-center font-bold shadow"
                          onClick={async () => {
                            try {
                              const msg = await sendSupplierInvoiceEmail(invoice.id);
                              alert(msg);
                            } catch (e) {
                              alert('Failed to send email');
                            }
                          }}
                          title="Send Email"
                        >
                          <FileText className="h-4 w-4 mr-1" /> Email
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Outlet Invoice Section */}
        {activeTab === 'outlet' && (
          <div className="mb-8 p-8 bg-[#3b2412] rounded-xl shadow-lg border border-gold-400 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
              <Store className="h-6 w-6 text-gold-400 mr-2" />
              <h2 className="text-2xl font-bold text-gold-400">Outlet Invoice</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gold-300 font-medium mb-1">Outlet</label>
                <select
                  className="w-full p-2 rounded border border-gold-400 bg-[#2a180c] text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  value={selectedOutlet}
                  onChange={e => setSelectedOutlet(e.target.value)}
                >
                  <option value="">Select outlet</option>
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} - {o.location}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={addOutletProduct} className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] w-full font-bold shadow">
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>
            {outletProducts.length > 0 && (
              <div className="mb-6 border border-gold-700/30 rounded-lg overflow-hidden bg-[#2a180c]">
                <table className="w-full text-gold-200">
                  <thead className="bg-[#3b2412]">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gold-400">Product</th>
                      <th className="p-3 text-left font-semibold text-gold-400">Quantity</th>
                      <th className="p-3 text-left font-semibold text-gold-400">Price</th>
                      <th className="p-3 text-gold-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {outletProducts.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-b-0 border-gold-700/20">
                        <td className="p-3">
                          <select
                            className="w-full p-2 rounded border border-gold-400 bg-[#3b2412] text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                            value={item.productId}
                            onChange={e => updateOutletProduct(idx, 'productId', e.target.value)}
                          >
                            <option value="">Select product</option>
                            {allProducts.products?.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          {(() => {
                             const selectedProduct = allProducts.products.find(p => p.id === Number(item.productId));
                             return selectedProduct ? (
                               <div className="text-xs text-gold-300 mt-1">
                                 Available: <span className="font-bold">{selectedProduct.quantity ?? selectedProduct.stock ?? 0}</span>
                               </div>
                             ) : null;
                          })()}
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => updateOutletProduct(idx, 'quantity', e.target.value)}
                            className="w-24 border border-gold-400 rounded bg-[#3b2412] text-gold-200"
                          />
                        </td>
                        <td className="p-3">₹{getOutletProductPrice(item.productId, item.quantity)}</td>
                        <td className="p-3 text-center">
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeOutletProduct(idx)} className="bg-red-700/20 hover:bg-red-700/40 text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {outletProducts.length > 0 && (
              <div className="flex flex-col items-end space-y-2 mb-4">
                <div className="text-gold-300">Subtotal: <span className="font-semibold">₹{outletSubtotal.toFixed(2)}</span></div>
                <div className="text-gold-300">Tax (18%): <span className="font-semibold">₹{outletTax.toFixed(2)}</span></div>
                <div className="text-gold-400 font-bold">Total: <span>₹{outletTotal.toFixed(2)}</span></div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] px-6 py-2 text-lg font-bold rounded shadow"
                disabled={!selectedOutlet || outletProducts.length === 0 || outletProducts.some(p => !p.productId || !p.quantity) || downloadingOutlet}
                onClick={async () => {
                  setDownloadingOutlet(true);
                  try {
                    await downloadOutletInvoicePDF(selectedOutlet, outletProducts.map(p => ({ productId: Number(p.productId), quantity: Number(p.quantity) })));
                  } catch (e) {
                    alert('Failed to download PDF');
                  }
                  setDownloadingOutlet(false);
                }}
              >
                {downloadingOutlet ? 'Generating PDF...' : (<><Download className="h-5 w-5 mr-2" /> Download Outlet Invoice PDF</>)}
              </Button>
              <Button
                type="button"
                className="bg-gold-400 hover:bg-gold-500 text-[#2a180c] px-6 py-2 text-lg font-bold rounded shadow"
                disabled={!selectedOutlet || outletProducts.length === 0 || outletProducts.some(p => !p.productId || !p.quantity) || downloadingOutlet}
                onClick={async () => {
                  setDownloadingOutlet(true);
                  try {
                    const msg = await sendOutletInvoiceEmail(selectedOutlet, outletProducts.map(p => ({ productId: Number(p.productId), quantity: Number(p.quantity) })));
                    alert(msg);
                  } catch (e) {
                    alert('Failed to send email');
                  }
                  setDownloadingOutlet(false);
                }}
              >
                <FileText className="h-5 w-5 mr-2" /> Send Email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}