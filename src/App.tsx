import { useState } from "react";
import type { Bill, BillItem } from "./types";
import { generateId } from "./utils/id";
import ParticipantForm from "./components/ParticipantForm";
import MenuItemForm from "./components/MenuItemForm";
import BillSummary from "./components/BillSummary";
import JsonDataHandler from "./components/JsonDataHandler";
import "./App.css";

function App() {
  const [bill, setBill] = useState<Bill>({
    id: generateId(),
    date: new Date().toISOString(),
    items: [],
    participants: [],
    serviceCharge: 0,
    tax: 0,
  });

  const [newItem, setNewItem] = useState<Omit<BillItem, "id" | "sharedBy">>({
    name: "",
    price: 0,
    quantity: 1,
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold">Bill Splitter</h1>
        </div>
      </header>

      <main className="app-main">
        <div className="flex flex-col space-y-6">
          {/* Left side - Input forms */}
          <div className="space-y-6">
            <div className="app-card">
              <h2 className="text-xl font-semibold">Add Participants</h2>
              <ParticipantForm bill={bill} setBill={setBill} />
            </div>

            <div className="app-card">
              <h2 className="text-xl font-semibold">Add Menu Items</h2>
              <MenuItemForm bill={bill} setBill={setBill} />
            </div>

            <div className="app-card">
              <h2 className="text-xl font-semibold">Import/Export Data</h2>
              <JsonDataHandler bill={bill} setBill={setBill} />
            </div>
          </div>

          {/* Right side - Summary */}
          <div className="app-card">
            <h2 className="text-xl font-semibold">Bill Summary</h2>
            <BillSummary bill={bill} setBill={setBill} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
