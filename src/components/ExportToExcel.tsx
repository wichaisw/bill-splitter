import { utils as xlsxUtils, writeFile } from "xlsx";
import type { Bill } from "../types";

interface ExportToExcelProps {
  bill: Bill;
}

const ExportToExcel = ({ bill }: ExportToExcelProps) => {
  const exportToExcel = () => {
    // Calculate totals
    const subtotal = bill.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const serviceChargeAmount = subtotal * (bill.serviceCharge / 100);
    const afterServiceCharge = subtotal + serviceChargeAmount;
    const taxAmount = afterServiceCharge * (bill.tax / 100);
    const total = afterServiceCharge + taxAmount;

    // Create items table with participant columns
    const itemsTable = bill.items.map((item) => {
      const row: Record<string, any> = {
        Menu: item.name,
        Price: item.price,
        Quantity: item.quantity,
        Total: item.price * item.quantity,
      };

      // Add a column for each participant showing their share
      bill.participants.forEach((participant) => {
        if (item.sharedBy.includes(participant.id)) {
          const shareCount = item.sharedBy.length;
          const itemShare = (item.price * item.quantity) / shareCount;
          row[participant.name] = itemShare.toFixed(2);
        } else {
          row[participant.name] = "-";
        }
      });

      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      Menu: "TOTAL",
      Price: "",
      Quantity: "",
      Total: subtotal.toFixed(2),
    };

    // Calculate and add participant totals
    bill.participants.forEach((participant) => {
      const participantItems = bill.items.filter((item) =>
        item.sharedBy.includes(participant.id)
      );
      const participantSubtotal = participantItems.reduce((total, item) => {
        const shareCount = item.sharedBy.length;
        const itemShare = (item.price * item.quantity) / shareCount;
        return total + itemShare;
      }, 0);

      const participantServiceCharge =
        participantSubtotal * (bill.serviceCharge / 100);
      const participantAfterServiceCharge =
        participantSubtotal + participantServiceCharge;
      const participantTax = participantAfterServiceCharge * (bill.tax / 100);
      const finalAmount = participantAfterServiceCharge + participantTax;

      totalsRow[participant.name] = finalAmount.toFixed(2);
    });

    itemsTable.push(totalsRow);

    // Create summary table
    const summaryTable = [
      {
        Description: "Subtotal",
        Amount: subtotal.toFixed(2),
      },
      {
        Description: `Service Charge (${bill.serviceCharge}%)`,
        Amount: serviceChargeAmount.toFixed(2),
      },
      {
        Description: `Tax (${bill.tax}%)`,
        Amount: taxAmount.toFixed(2),
      },
      {
        Description: "Grand Total",
        Amount: total.toFixed(2),
      },
    ];

    // Create workbook
    const wb = xlsxUtils.book_new();

    // Add items table with styling
    const wsItems = xlsxUtils.json_to_sheet(itemsTable);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Menu
      { wch: 10 }, // Price
      { wch: 10 }, // Quantity
      { wch: 12 }, // Total
      ...bill.participants.map(() => ({ wch: 12 })), // Participant columns
    ];
    wsItems["!cols"] = colWidths;

    // Add summary table
    const wsSummary = xlsxUtils.json_to_sheet(summaryTable);
    wsSummary["!cols"] = [{ wch: 25 }, { wch: 15 }];

    // Add worksheets to workbook
    xlsxUtils.book_append_sheet(wb, wsItems, "Bill Details");
    xlsxUtils.book_append_sheet(wb, wsSummary, "Summary");

    // Generate filename with date
    const date = new Date(bill.date).toLocaleDateString().replace(/\//g, "-");
    const filename = `Bill_Splitter_${date}.xlsx`;

    // Save file
    writeFile(wb, filename);
  };

  return (
    <button
      onClick={exportToExcel}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Export to Excel
    </button>
  );
};

export default ExportToExcel;
