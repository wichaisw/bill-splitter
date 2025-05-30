import type { Bill } from "../types";

interface BillPreviewProps {
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
}

export default function BillPreview({
  bill,
  isOpen,
  onClose,
}: BillPreviewProps) {
  if (!isOpen) return null;

  const subtotal = bill.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const serviceChargeAmount = subtotal * (bill.serviceCharge / 100);
  const afterServiceCharge = subtotal + serviceChargeAmount;
  const taxAmount = afterServiceCharge * (bill.tax / 100);
  const total = afterServiceCharge + taxAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Bill Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
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
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {participant.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bill.items.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ฿{item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ฿{itemTotal.toFixed(2)}
                      </td>
                      {bill.participants.map((participant) => {
                        const shareCount = item.sharedBy.length;
                        const itemShare = item.sharedBy.includes(participant.id)
                          ? (itemTotal / shareCount).toFixed(2)
                          : "-";
                        return (
                          <td
                            key={participant.id}
                            className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                          >
                            {itemShare === "-" ? "-" : `฿${itemShare}`}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {/* Subtotal Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    SUBTOTAL
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    -
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    -
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    ฿{subtotal.toFixed(2)}
                  </td>
                  {bill.participants.map((participant) => {
                    const participantItems = bill.items.filter((item) =>
                      item.sharedBy.includes(participant.id)
                    );
                    const participantSubtotal = participantItems.reduce(
                      (total, item) => {
                        const shareCount = item.sharedBy.length;
                        const itemShare =
                          (item.price * item.quantity) / shareCount;
                        return total + itemShare;
                      },
                      0
                    );

                    return (
                      <td
                        key={participant.id}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                      >
                        ฿{participantSubtotal.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                {/* Net Total Row */}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    NET TOTAL
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    -
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    -
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    ฿{total.toFixed(2)}
                  </td>
                  {bill.participants.map((participant) => {
                    const participantItems = bill.items.filter((item) =>
                      item.sharedBy.includes(participant.id)
                    );
                    const participantSubtotal = participantItems.reduce(
                      (total, item) => {
                        const shareCount = item.sharedBy.length;
                        const itemShare =
                          (item.price * item.quantity) / shareCount;
                        return total + itemShare;
                      },
                      0
                    );
                    const participantServiceCharge =
                      participantSubtotal * (bill.serviceCharge / 100);
                    const participantAfterServiceCharge =
                      participantSubtotal + participantServiceCharge;
                    const participantTax =
                      participantAfterServiceCharge * (bill.tax / 100);
                    const finalAmount =
                      participantAfterServiceCharge + participantTax;

                    return (
                      <td
                        key={participant.id}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                      >
                        ฿{finalAmount.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Service Charge ({bill.serviceCharge}%)
                </span>
                <span className="text-gray-900">
                  ฿{serviceChargeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({bill.tax}%)</span>
                <span className="text-gray-900">฿{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span className="text-gray-900">Grand Total</span>
                <span className="text-gray-900">฿{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
