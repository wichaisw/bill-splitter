import { useState } from "react";
import type { Bill } from "./types";
import { generateId } from "./utils/id";
import ParticipantForm from "./components/ParticipantForm";
import MenuItemForm from "./components/MenuItemForm";
import BillSummary from "./components/BillSummary";
import JsonDataHandler from "./components/JsonDataHandler";
import SessionManager from "./components/SessionManager";

function App() {
  const [bill, setBill] = useState<Bill>({
    id: generateId(),
    date: new Date().toISOString(),
    items: [],
    participants: [],
    serviceCharge: 0,
    tax: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Bill Splitter
            </h1>
            <div className="flex items-center gap-4">
              <SessionManager bill={bill} setBill={setBill} />
              <JsonDataHandler bill={bill} setBill={setBill} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Input forms */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">
                Add Participants
              </h2>
              <ParticipantForm bill={bill} setBill={setBill} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">
                Add Menu Items
              </h2>
              <MenuItemForm bill={bill} setBill={setBill} />
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">
                Bill Summary
              </h2>
              <BillSummary bill={bill} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
