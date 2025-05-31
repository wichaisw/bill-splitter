import { useState, useEffect } from "react";
import type { Bill } from "../types";

interface ChargeSettingsProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

export default function ChargeSettings({ bill, setBill }: ChargeSettingsProps) {
  const [serviceCharge, setServiceCharge] = useState(
    bill.serviceCharge.toString()
  );
  const [tax, setTax] = useState(bill.tax.toString());

  // Update local state when bill prop changes
  useEffect(() => {
    setServiceCharge(bill.serviceCharge.toString());
    setTax(bill.tax.toString());
  }, [bill.serviceCharge, bill.tax]);

  const handleServiceChargeChange = (value: string) => {
    setServiceCharge(value);
    const numValue = parseFloat(value) || 0;
    setBill({
      ...bill,
      serviceCharge: numValue,
    });
  };

  const handleTaxChange = (value: string) => {
    setTax(value);
    const numValue = parseFloat(value) || 0;
    setBill({
      ...bill,
      tax: numValue,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Charge (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={serviceCharge}
            onChange={(e) => handleServiceChargeChange(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              text-gray-900 placeholder-gray-400 bg-white
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute left-3 top-2 text-gray-500">%</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tax (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={tax}
            onChange={(e) => handleTaxChange(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              text-gray-900 placeholder-gray-400 bg-white
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute left-3 top-2 text-gray-500">%</span>
        </div>
      </div>
    </div>
  );
}
