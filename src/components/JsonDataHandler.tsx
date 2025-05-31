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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
    } catch (error) {
      setImportError("Invalid JSON format or data structure");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 
          text-white rounded-lg transition-colors duration-200 focus:outline-none 
          focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Import
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Import Inputs
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 transition-colors"
                  >
                    Copy as JSON
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import JSON Data
                  </label>
                  <textarea
                    onChange={handleImport}
                    placeholder="Paste JSON data here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      text-gray-900 placeholder-gray-400 bg-white min-h-[200px]"
                  />
                  {importError && (
                    <p className="mt-2 text-sm text-red-600">{importError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
