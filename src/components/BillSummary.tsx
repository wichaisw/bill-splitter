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

  const calculateParticipantTotal = (participantId: string) => {
    return bill.items.reduce((total, item) => {
      if (item.sharedBy.includes(participantId)) {
        return (
          total +
          calculateItemShare(item.price, item.quantity, item.sharedBy.length)
        );
      }
      return total;
    }, 0);
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
      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bill.participants.map((participant) => {
              const participantTotal = calculateParticipantTotal(
                participant.id
              );
              const participantShare =
                (participantTotal / subtotal) *
                (serviceChargeAmount + taxAmount);
              const finalAmount = participantTotal + participantShare;

              return (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${participant.color} mr-2`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {participant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${finalAmount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                ${total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

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
    </div>
  );
}
