import { useState } from "react";
import { Bill } from "./types";
import "./App.css";

function App() {
  const [bill, setBill] = useState<Bill>({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    items: [],
    participants: [],
    serviceCharge: 0,
    tax: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Bill Splitter</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Input forms */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Add Details</h2>
              {/* Forms will go here */}
            </div>

            {/* Right side - Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
              {/* Summary will go here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
