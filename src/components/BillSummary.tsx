import type { Bill } from "../types";

interface BillSummaryProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

export default function BillSummary({ bill, setBill }: BillSummaryProps) {
  const calculateItemShare = (
    itemPrice: number,
    itemQuantity: number,
    sharedByCount: number
  ) => {
    return (itemPrice * itemQuantity) / sharedByCount;
  };

  const subtotal = bill.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const serviceChargeAmount = (subtotal * bill.serviceCharge) / 100;
  const taxAmount = (subtotal * bill.tax) / 100;
  const total = subtotal + serviceChargeAmount + taxAmount;

  return (
    <div className="space-y-6">
      {/* Detailed Summary for Each Participant */}
      {bill.participants.map((participant) => {
        const participantItems = bill.items.filter((item) =>
          item.sharedBy.includes(participant.id)
        );
        const participantSubtotal = participantItems.reduce((total, item) => {
          const shareCount = item.sharedBy.length;
          const itemShare = calculateItemShare(
            item.price,
            item.quantity,
            shareCount
          );
          return total + itemShare;
        }, 0);
        const participantShare =
          (participantSubtotal / subtotal) * (serviceChargeAmount + taxAmount);
        const finalAmount = participantSubtotal + participantShare;

        return (
          <div
            key={participant.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-4 h-4 rounded-full ${participant.color} mr-2`}
              ></div>
              <h3 className="text-lg font-semibold text-gray-900">
                {participant.name}
              </h3>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 mb-4">
              {participantItems.map((item) => {
                const shareCount = item.sharedBy.length;
                const itemShare = calculateItemShare(
                  item.price,
                  item.quantity,
                  shareCount
                );
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} ({item.quantity}x)
                    </span>
                    <span className="text-gray-900">
                      ฿{itemShare.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items Subtotal</span>
                <span className="text-gray-900">
                  ฿{participantSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Service Charge & Tax Share
                </span>
                <span className="text-gray-900">
                  ฿{participantShare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">฿{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Service Charge and Tax Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Charge (%)
          </label>
          <input
            type="number"
            value={bill.serviceCharge}
            onChange={(e) =>
              setBill({
                ...bill,
                serviceCharge: parseFloat(e.target.value) || 0,
              })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax (%)
          </label>
          <input
            type="number"
            value={bill.tax}
            onChange={(e) =>
              setBill({ ...bill, tax: parseFloat(e.target.value) || 0 })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      {/* Overall Total */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Overall Total
          </span>
          <span className="text-2xl font-bold text-gray-900">
            ฿{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
