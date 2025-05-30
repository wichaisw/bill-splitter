import { useState } from "react";
import type { Bill, BillItem, Participant } from "./types";
import { generateId } from "./utils/id";
import ParticipantForm from "./components/ParticipantForm";
import MenuItemForm from "./components/MenuItemForm";
import BillSummary from "./components/BillSummary";

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

  const [newParticipant, setNewParticipant] = useState("");

  const addItem = () => {
    if (!newItem.name || newItem.price <= 0) return;

    const item: BillItem = {
      ...newItem,
      id: crypto.randomUUID(),
      sharedBy: bill.participants.map((p) => p.id), // Default share with everyone
    };

    setBill((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({
      name: "",
      price: 0,
      quantity: 1,
    });
  };

  const addParticipant = () => {
    if (!newParticipant.trim()) return;

    const participant: Participant = {
      id: crypto.randomUUID(),
      name: newParticipant.trim(),
    };

    setBill((prev) => ({
      ...prev,
      participants: [...prev.participants, participant],
    }));

    setNewParticipant("");
  };

  const toggleItemShare = (itemId: string, participantId: string) => {
    setBill((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const sharedBy = item.sharedBy.includes(participantId)
            ? item.sharedBy.filter((id) => id !== participantId)
            : [...item.sharedBy, participantId];
          return { ...item, sharedBy };
        }
        return item;
      }),
    }));
  };

  const calculateParticipantTotal = (participantId: string) => {
    const itemTotal = bill.items.reduce((total, item) => {
      if (!item.sharedBy.includes(participantId)) return total;
      const shareCount = item.sharedBy.length;
      const itemShare = (item.price * item.quantity) / shareCount;
      return total + itemShare;
    }, 0);

    const participantCount = bill.participants.length;
    const serviceChargeShare = bill.serviceCharge / participantCount;
    const taxShare = bill.tax / participantCount;

    return itemTotal + serviceChargeShare + taxShare;
  };

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
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl ">Add Participants</h2>
                <ParticipantForm bill={bill} setBill={setBill} />
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Add Menu Items</h2>
                <MenuItemForm bill={bill} setBill={setBill} />
              </div>
            </div>

            {/* Right side - Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
              <BillSummary bill={bill} setBill={setBill} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
