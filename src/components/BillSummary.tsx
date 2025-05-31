import type { Bill } from "../types";
import ExportToExcel from "./ExportToExcel";
import { add, multiply, divide, calculatePercentage } from "../utils/math";
import { useState } from "react";

interface BillSummaryProps {
  bill: Bill;
}

export default function BillSummary({ bill }: BillSummaryProps) {
  const [copySuccess, setCopySuccess] = useState<string>("");

  const subtotal = bill.items.reduce(
    (total, item) => add(total, multiply(item.price, item.quantity)),
    0
  );
  const serviceChargeAmount = calculatePercentage(subtotal, bill.serviceCharge);
  const afterServiceCharge = add(subtotal, serviceChargeAmount);
  const taxAmount = calculatePercentage(afterServiceCharge, bill.tax);
  const total = add(afterServiceCharge, taxAmount);

  const getParticipantTotal = (participantId: string) => {
    const participantItems = bill.items.filter((item) =>
      item.sharedBy.includes(participantId)
    );
    const participantSubtotal = participantItems.reduce((total, item) => {
      const shareCount = item.sharedBy.length;
      const itemShare = divide(multiply(item.price, item.quantity), shareCount);
      return add(total, itemShare);
    }, 0);
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
    return add(participantAfterServiceCharge, participantTax);
  };

  const copyToClipboard = () => {
    const text = bill.participants
      .map((participant) => {
        const total = getParticipantTotal(participant.id);
        return `${participant.name}: ฿${total.toFixed(2)}`;
      })
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopySuccess("Copied to clipboard!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bill Summary</h2>

      {/* Items Table */}
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-[120px] sm:w-[160px]">
                  Menu
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-[100px]">
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
                    <td className="sticky left-0 z-10 max-w-[150px] lg:max-h-[500px] overflow-wrap-anywhere bg-white px-2 sm:px-4 py-3 text-sm text-gray-900 border-r border-gray-200 w-[120px] sm:w-[160px] break-words">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200 w-[100px]">
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
                <td className="sticky left-0 z-10 bg-gray-50 px-2 sm:px-4 py-3 text-sm text-gray-900 border-r border-gray-200 w-[120px] sm:w-[160px] break-words">
                  SUBTOTAL
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200 w-[100px]">
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
                <td className="sticky left-0 z-10 bg-gray-100 px-2 sm:px-4 py-3 text-sm text-gray-900 border-r border-gray-200 w-[120px] sm:w-[160px] break-words">
                  NET TOTAL
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right border-r border-gray-200 w-[100px]">
                  -
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  -
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  ฿{total.toFixed(2)}
                </td>
                {bill.participants.map((participant) => {
                  const participantTotal = getParticipantTotal(participant.id);
                  return (
                    <td
                      key={participant.id}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                    >
                      ฿{participantTotal.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
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

      {/* Participant Totals */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Individual Totals
          </h3>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md 
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy All
          </button>
        </div>
        {copySuccess && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
            {copySuccess}
          </div>
        )}
        <div className="space-y-2">
          {bill.participants.map((participant) => {
            const total = getParticipantTotal(participant.id);
            return (
              <div
                key={participant.id}
                className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${participant.color}`}
                  ></div>
                  <span className="font-medium text-gray-900">
                    {participant.name}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  ฿{total.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <ExportToExcel bill={bill} />
    </div>
  );
}
