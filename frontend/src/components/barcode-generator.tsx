import React, { useState, useRef, useEffect } from "react";
import Barcode from "react-barcode";

interface ProductMin {
  id: number;
  name: string;
  expiryDate?: string;
  manufacturerDate?: string;
  manufacturerCode?: string;
}

const BarcodeGenerator: React.FC = () => {
  const [products, setProducts] = useState<ProductMin[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [loading, setLoading] = useState(false);
  const barcodeRef = useRef<HTMLDivElement>(null);

  // Fetch products for dropdown
  useEffect(() => {
    fetch("/api/products-min")
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Generate barcode when product is selected
  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setBarcodeValue("");
    try {
      const res = await fetch(`/api/barcodes-new/generate/${selectedProduct}?manufacturerCode=${selectedProductObj?.manufacturerCode}`, { method: "POST" });
      const data = await res.json();
      setBarcodeValue(data.code);
    } catch {
      setBarcodeValue("");
    }
    setLoading(false);
  };

  // Download barcode as image
  const handleDownload = () => {
    const svg = barcodeRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `barcode-${barcodeValue}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + window.btoa(svgString);
  };

  const selectedProductObj = products.find(p => p.id === selectedProduct);

  return (
    <div className="max-w-md w-full mx-auto p-4 bg-[#3b2412] rounded shadow flex flex-col gap-4 sm:gap-6">
      <h2 className="text-xl font-bold mb-2 text-yellow-500">Barcode Generator</h2>
      <label className="block font-medium text-yellow-500">Select Product</label>
      <select
        className="border border-[#a97c50] focus:border-yellow-500 px-2 py-1 w-full mb-2 bg-[#4e2e13] text-yellow-100"
        value={selectedProduct ?? ""}
        onChange={e => setSelectedProduct(Number(e.target.value))}
      >
        <option value="">Choose a product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      {selectedProductObj && (
        <div className="mb-2 text-yellow-200 text-sm">
          <div>Expiry Date: {selectedProductObj.expiryDate ? new Date(selectedProductObj.expiryDate).toLocaleDateString() : 'N/A'}</div>
          <div>Manufacturer Date: {selectedProductObj.manufacturerDate ? new Date(selectedProductObj.manufacturerDate).toLocaleDateString() : 'N/A'}</div>
          <div>Manufacturer Code: {selectedProductObj.manufacturerCode || 'N/A'}</div>
        </div>
      )}
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mb-2"
        onClick={handleGenerate}
        disabled={!selectedProduct || loading}
      >
        {loading ? "Generating..." : "Generate Barcode"}
      </button>
      {barcodeValue && (
        <>
          <div ref={barcodeRef} className="flex justify-center my-4 bg-[#fff9e6] p-4 rounded">
            <Barcode value={barcodeValue} format="EAN13" width={2} height={100} displayValue />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              onClick={handleDownload}
            >
              Download PNG
            </button>
            <button
              className="bg-[#a97c50] hover:bg-[#8b5c2a] text-white px-4 py-2 rounded"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BarcodeGenerator; 