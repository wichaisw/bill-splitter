import { useState } from "react";
import type { Bill, MenuItem } from "../types";
import { generateId } from "../utils/id";

interface MenuItemFormProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

export default function MenuItemForm({ bill, setBill }: MenuItemFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");

  const addMenuItem = () => {
    if (name.trim() && price && quantity) {
      const newItem: MenuItem = {
        id: generateId(),
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        sharedBy: [], // Will be updated through the table
      };

      setBill({
        ...bill,
        items: [...bill.items, newItem],
      });

      // Reset form
      setName("");
      setPrice("");
      setQuantity("1");
    }
  };

  const toggleParticipantForItem = (itemId: string, participantId: string) => {
    setBill({
      ...bill,
      items: bill.items.map((item) => {
        if (item.id === itemId) {
          const sharedBy = item.sharedBy.includes(participantId)
            ? item.sharedBy.filter((id) => id !== participantId)
            : [...item.sharedBy, participantId];
          return { ...item, sharedBy };
        }
        return item;
      }),
    });
  };

  const removeItem = (itemId: string) => {
    setBill({
      ...bill,
      items: bill.items.filter((item) => item.id !== itemId),
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Item
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pad Thai"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (฿)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">฿</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  text-gray-900 placeholder-gray-400 bg-white
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                text-gray-900 placeholder-gray-400 bg-white
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <button
          onClick={addMenuItem}
          disabled={!name.trim() || !price || !quantity}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-colors"
        >
          Add Item
        </button>
      </div>

      {/* Items Table */}
      {bill.items.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Menu and Participants
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menu
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  {bill.participants.map((participant) => (
                    <th
                      key={participant.id}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${participant.color}`}
                        ></div>
                        <span>{participant.name}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bill.items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      ฿{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ฿{(item.price * item.quantity).toFixed(2)}
                    </td>
                    {bill.participants.map((participant) => (
                      <td
                        key={participant.id}
                        className="px-4 py-3 whitespace-nowrap text-center"
                      >
                        <input
                          type="checkbox"
                          checked={item.sharedBy.includes(participant.id)}
                          onChange={() =>
                            toggleParticipantForItem(item.id, participant.id)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
