import { useState, useEffect } from "react";
import type { Bill } from "../types";

interface SessionManagerProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

const STORAGE_KEY = "bill-splitter-session";

export default function SessionManager({ bill, setBill }: SessionManagerProps) {
  const [hasStoredSession, setHasStoredSession] = useState(false);

  // Check for stored session on component mount
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    setHasStoredSession(!!storedSession);
  }, []);

  // Save session whenever bill changes
  useEffect(() => {
    if (bill.items.length > 0 || bill.participants.length > 0) {
      // Ensure serviceCharge and tax are included
      const sessionData = {
        ...bill,
        serviceCharge: bill.serviceCharge || 0,
        tax: bill.tax || 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setHasStoredSession(true);
    }
  }, [bill]);

  const restoreSession = () => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Ensure serviceCharge and tax are included when restoring
        const restoredSession = {
          ...parsedSession,
          serviceCharge: parsedSession.serviceCharge || 0,
          tax: parsedSession.tax || 0,
        };
        setBill(restoredSession);
      } catch (error) {
        console.error("Failed to restore session:", error);
      }
    }
  };

  if (!hasStoredSession) {
    return null;
  }

  return (
    <button
      onClick={restoreSession}
      className="inline-flex items-center px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 
        text-white rounded-lg transition-colors duration-200 focus:outline-none 
        focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm sm:text-base">
        <span className="sm:hidden">Restore</span>
        <span className="hidden sm:inline">Restore Last Session</span>
      </span>
    </button>
  );
}
