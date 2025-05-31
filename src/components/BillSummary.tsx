import type { Bill } from "../types";
import ExportToExcel from "./ExportToExcel";
import { add, multiply, divide, calculatePercentage } from "../utils/math";

interface BillSummaryProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

export default function BillSummary({ bill, setBill }: BillSummaryProps) {
  const subtotal = bill.items.reduce(
    (total, item) => add(total, multiply(item.price, item.quantity)),
    0
  );
  const serviceChargeAmount = calculatePercentage(subtotal, bill.serviceCharge);
  const afterServiceCharge = add(subtotal, serviceChargeAmount);
  const taxAmount = calculatePercentage(afterServiceCharge, bill.tax);
  const total = add(afterServiceCharge, taxAmount);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bill Summary</h2>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {participant.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bill.items.map((item) => {
              const itemTotal = multiply(item.price, item.quantity);
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
                      ? divide(itemTotal, shareCount)
                      : 0;
                    return (
                      <td
                        key={participant.id}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                      >
                        {itemShare === 0 ? "-" : `฿${itemShare.toFixed(2)}`}
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
                    const itemShare = divide(
                      multiply(item.price, item.quantity),
                      shareCount
                    );
                    return add(total, itemShare);
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
                    const itemShare = divide(
                      multiply(item.price, item.quantity),
                      shareCount
                    );
                    return add(total, itemShare);
                  },
                  0
                );
                const participantServiceCharge = calculatePercentage(
                  participantSubtotal,
                  bill.serviceCharge
                );
                const participantAfterServiceCharge = add(
                  participantSubtotal,
                  participantServiceCharge
                );
                const participantTax = calculatePercentage(
                  participantAfterServiceCharge,
                  bill.tax
                );
                const finalAmount = add(
                  participantAfterServiceCharge,
                  participantTax
                );

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
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
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

      {/* Export Button */}
      <ExportToExcel bill={bill} />
    </div>
  );
}
