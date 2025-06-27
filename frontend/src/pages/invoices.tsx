import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileText, DollarSign, Calendar, CheckCircle, Download } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { apiRequest } from '../lib/queryClient';
import jsPDF from 'jspdf';

const sampleInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    supplier: { name: 'Farm Fresh Co.' },
    amount: 4500.00,
    status: 'PAID',
    createdAt: new Date().toISOString(),
    products: [
      { name: 'Premium Basmati Rice' },
      { name: 'Organic Honey' },
    ],
  },
  {
    id: 2,
    invoiceNumber: 'INV-002',
    supplier: { name: 'Pure Naturals' },
    amount: 3200.00,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    products: [
      { name: 'Fresh Milk 1L' },
    ],
  },
];

function downloadInvoicePDF(invoice) {
  const doc = new jsPDF();
  // Gold header bar
  doc.setFillColor(251, 191, 36); // #fbbf24
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(20);
  doc.setTextColor(59, 36, 18); // #3b2412
  doc.text('eMart 5 Star - Premium Inventory', 10, 14);

  // Invoice details section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 30;
  doc.setFont(undefined, 'bold');
  doc.text(String('Invoice Details'), 10, Number(y || 0));
  doc.setFont(undefined, 'normal');
  y += 8;
  doc.text(String('Invoice #:'), 10, Number(y || 0)); doc.text(String(invoice.invoiceNumber || invoice.id || ''), 45, Number(y || 0));
  y += 8;
  doc.text(String('Supplier:'), 10, Number(y || 0)); doc.text(String(invoice.supplier?.name || ''), 45, Number(y || 0));
  y += 8;
  doc.text(String('Amount:'), 10, Number(y || 0)); doc.text(String(`₹${invoice.amount?.toFixed(2) || invoice.totalAmount?.toFixed(2) || '0.00'}`), 45, Number(y || 0));
  y += 8;
  doc.text(String('Status:'), 10, Number(y || 0)); doc.text(String(invoice.status || ''), 45, Number(y || 0));
  y += 8;
  doc.text(String('Date:'), 10, Number(y || 0)); doc.text(String(new Date(invoice.createdAt).toLocaleString() || ''), 45, Number(y || 0));

  // Divider
  y += 6;
  doc.setDrawColor(251, 191, 36);
  doc.line(10, y, 200, y);
  y += 8;

  // Products section
  doc.setFont(undefined, 'bold');
  doc.text(String('Products'), 10, Number(y || 0));
  doc.setFont(undefined, 'normal');
  y += 8;
  if (invoice.products && invoice.products.length > 0) {
    invoice.products.forEach((product, idx) => {
      doc.text(String(`- ${product?.name || product || ''}`), 15, Number(y + idx * 7 || 0));
    });
    y += invoice.products.length * 7;
  } else {
    doc.text(String('- (No product details)'), 15, Number(y || 0));
    y += 7;
  }

  // Divider
  y += 6;
  doc.setDrawColor(251, 191, 36);
  doc.line(10, y, 200, y);
  y += 10;

  // Signature area
  doc.setFont(undefined, 'bold');
  doc.text(String('Signature:'), 10, Number(y || 0));
  doc.setFont(undefined, 'normal');
  doc.line(35, Number(y + 1 || 1), 100, Number(y + 1 || 1));
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(59, 36, 18);
  doc.text(String('eMart Inventory System'), 10, Number(y || 0));

  doc.save(`${invoice.invoiceNumber || invoice.id}.pdf`);
}

export default function Invoices() {
  const { data: invoiceData, isLoading, isError } = useQuery({
    queryKey: ['/api/invoices'],
    queryFn: () => apiRequest('/api/invoices'),
    initialData: [],
  });

  const displayInvoices = (invoiceData && invoiceData.length > 0) ? invoiceData : sampleInvoices;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-yellow-500 gradient-text">Invoices</h1>
      </div>
      <table className="min-w-full rounded shadow bg-[#3b2412]">
        <thead className="bg-[#4e2e13]">
          <tr>
            <th className="p-4 text-left text-yellow-500">Invoice #</th>
            <th className="p-4 text-left text-yellow-500">Supplier</th>
            <th className="p-4 text-left text-yellow-500">Amount</th>
            <th className="p-4 text-left text-yellow-500">Status</th>
            <th className="p-4 text-left text-yellow-500">Date</th>
            <th className="p-4 text-left text-yellow-500">Products</th>
            <th className="p-4 text-left text-yellow-500">Download</th>
          </tr>
        </thead>
        <tbody>
          {displayInvoices.map((invoice, index) => (
            <motion.tr
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="border-b border-[#6b4a2b] hover:bg-[#4e2e13]/80 transition-colors group"
            >
              <td className="p-4 font-medium text-[#fbbf24]">{invoice.invoiceNumber || invoice.id}</td>
              <td className="p-4 text-[#fbbf24]">{invoice.supplier?.name || ''}</td>
              <td className="p-4 text-[#fbbf24]">₹{invoice.amount?.toFixed(2) || invoice.totalAmount?.toFixed(2) || '0.00'}</td>
              <td className="p-4">
                {invoice.status === 'PAID' ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>
                )}
              </td>
              <td className="p-4 text-[#fbbf24]">{new Date(invoice.createdAt).toLocaleString()}</td>
              <td className="p-4 text-[#fbbf24]">
                <ul>
                  {(invoice.products && invoice.products.length > 0)
                    ? invoice.products.map((product, idx) => (
                        <li key={idx}>{product.name || product}</li>
                      ))
                    : <li>(No product details)</li>
                  }
                </ul>
              </td>
              <td className="p-4">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center"
                  onClick={() => downloadInvoicePDF(invoice)}
                  title="Download PDF"
                >
                  <Download className="h-4 w-4 mr-1" /> PDF
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}