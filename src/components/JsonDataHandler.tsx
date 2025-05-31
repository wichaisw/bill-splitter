import { useState } from "react";
import type { Bill } from "../types";

interface JsonDataHandlerProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

export default function JsonDataHandler({
  bill,
  setBill,
}: JsonDataHandlerProps) {
  const [importError, setImportError] = useState<string>("");

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(bill, null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  const handleImport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const importedData = JSON.parse(event.target.value);

      // Validate the imported data structure
      if (!importedData.items || !importedData.participants) {
        throw new Error("Invalid data structure");
      }

      setBill(importedData);
      setImportError("");
    } catch (error) {
      setImportError("Invalid JSON format or data structure");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 transition-colors"
        >
          Copy as JSON
        </button>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Import JSON Data
        </label>
        <textarea
          onChange={handleImport}
          placeholder="Paste JSON data here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            text-gray-900 placeholder-gray-400 bg-white min-h-[100px]"
        />
        {importError && <p className="text-red-500 text-sm">{importError}</p>}
      </div>
    </div>
  );
}
