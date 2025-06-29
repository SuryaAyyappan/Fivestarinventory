import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { Download, Upload, Eye, Check, X } from 'lucide-react';

interface CSVImportProps {
  role: string;
  username: string;
}

interface CSVImport {
  id: number;
  fileName: string;
  uploadedBy: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  errorDetails?: string;
}

interface CSVImportItem {
  id: number;
  name: string;
  sku: string;
  categoryName: string;
  supplierName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  errorMessage?: string;
}

export function CSVImport({ role, username }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingImports, setPendingImports] = useState<CSVImport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImport, setSelectedImport] = useState<CSVImport | null>(null);
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);
  const [importItems, setImportItems] = useState<CSVImportItem[]>([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [importToReject, setImportToReject] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const API_BASE = '/api/csv-import';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const uploadCSV = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'role': role,
          'username': username,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: result.message,
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Reload pending imports if user is checker/admin
        if (role === 'CHECKER' || role === 'ADMIN') {
          loadPendingImports();
        }
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload CSV",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE}/template`, {
        headers: {
          'role': role,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product_import_template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast({
          title: "Download failed",
          description: "Failed to download template",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const loadPendingImports = async () => {
    if (role !== 'CHECKER' && role !== 'ADMIN') return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pending?page=0&size=10`, {
        headers: {
          'role': role,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setPendingImports(result.imports || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending imports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadImportItems = async (importId: number) => {
    try {
      const response = await fetch(`${API_BASE}/${importId}/items`, {
        headers: {
          'role': role,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setImportItems(result.items || []);
        setSelectedImportId(importId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load import items",
        variant: "destructive",
      });
    }
  };

  const approveImport = async (importId: number) => {
    try {
      const response = await fetch(`${API_BASE}/${importId}/approve`, {
        method: 'POST',
        headers: {
          'role': role,
          'username': username,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Approved",
          description: result.message,
        });
        loadPendingImports();
        setSelectedImportId(null);
        setImportItems([]);
      } else {
        toast({
          title: "Approval failed",
          description: result.error || "Failed to approve import",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Approval failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const showRejectionDialog = (importId: number) => {
    setImportToReject(importId);
    setShowRejectionModal(true);
    setRejectionReason('');
  };

  const confirmRejection = async () => {
    if (!importToReject || !rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${importToReject}/reject`, {
        method: 'POST',
        headers: {
          'role': role,
          'username': username,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Rejected",
          description: result.message,
        });
        loadPendingImports();
        setSelectedImportId(null);
        setImportItems([]);
        setShowRejectionModal(false);
        setImportToReject(null);
        setRejectionReason('');
      } else {
        toast({
          title: "Rejection failed",
          description: result.error || "Failed to reject import",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Rejection failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const cancelRejection = () => {
    setShowRejectionModal(false);
    setImportToReject(null);
    setRejectionReason('');
  };

  React.useEffect(() => {
    if (role === 'CHECKER' || role === 'ADMIN') {
      loadPendingImports();
    }
  }, [role]);

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
      PROCESSED: 'default',
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Maker/Admin Section - Upload CSV */}
      {(role === 'MAKER' || role === 'ADMIN') && (
        <Card>
          <CardHeader>
            <CardTitle>Import Products from CSV</CardTitle>
            <CardDescription>
              Upload a CSV file to import products in bulk. {role === 'ADMIN' ? 'As an admin, you can directly approve products.' : 'The file will be reviewed by a checker before approval.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select CSV File</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <Button 
              onClick={uploadCSV} 
              disabled={!file || uploading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Checker/Admin Section - Review Imports */}
      {(role === 'CHECKER' || role === 'ADMIN') && (
        <Card>
          <CardHeader>
            <CardTitle>Pending CSV Imports</CardTitle>
            <CardDescription>
              Review and approve or reject CSV import requests from makers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : pendingImports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending imports found.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingImports.map((importItem) => (
                  <div key={importItem.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{importItem.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded by {importItem.uploadedBy} on {new Date(importItem.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{importItem.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Total Records:</span>
                        <span className="ml-2 font-medium">{importItem.totalRecords}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Valid Records:</span>
                        <span className="ml-2 font-medium">{importItem.validRecords}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Invalid Records:</span>
                        <span className="ml-2 font-medium">{importItem.invalidRecords}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => loadImportItems(importItem.id)}
                        variant="outline"
                      >
                        View Details
                      </Button>
                      {importItem.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveImport(importItem.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => showRejectionDialog(importItem.id)}
                            variant="destructive"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>

                    {selectedImportId === importItem.id && importItems.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-2 text-yellow-700">Import Items</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {importItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-[#f9f6f2] rounded-lg shadow-sm border border-yellow-200 hover:bg-yellow-50 transition-colors"
                            >
                              <div>
                                <div className="font-semibold text-yellow-900">{item.name}</div>
                                <div className="text-xs text-yellow-700">SKU: {item.sku}</div>
                                <div className="text-xs text-yellow-700">Supplier: {item.supplierName}</div>
                                <div className="text-xs text-yellow-700">Category: {item.categoryName}</div>
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                {getStatusBadge(item.status)}
                                {item.errorMessage && (
                                  <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mt-1 max-w-xs text-right">
                                    {item.errorMessage}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Reject Import</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-2 border rounded mb-4 h-24"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelRejection}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmRejection}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}