import React from "react";
import BarcodeGenerator from "../components/barcode-generator";

export default function BarcodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300">
      <BarcodeGenerator />
    </div>
  );
} 