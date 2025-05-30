import { useState } from "react";
import type { Bill, Participant } from "../types";
import { generateId } from "../utils/id";

interface ParticipantFormProps {
  bill: Bill;
  setBill: (bill: Bill) => void;
}

const PARTICIPANT_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
];

export default function ParticipantForm({
  bill,
  setBill,
}: ParticipantFormProps) {
  const [name, setName] = useState("");

  const addParticipant = () => {
    if (name.trim()) {
      const newParticipant: Participant = {
        id: generateId(),
        name: name.trim(),
        color:
          PARTICIPANT_COLORS[
            bill.participants.length % PARTICIPANT_COLORS.length
          ],
      };

      setBill({
        ...bill,
        participants: [...bill.participants, newParticipant],
      });

      setName("");
    }
  };

  const removeParticipant = (participantId: string) => {
    setBill({
      ...bill,
      participants: bill.participants.filter((p) => p.id !== participantId),
      items: bill.items.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((id) => id !== participantId),
      })),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter participant name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && addParticipant()}
        />
        <button
          onClick={addParticipant}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {bill.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${participant.color}`}
              ></div>
              <span className="font-medium">{participant.name}</span>
            </div>
            <button
              onClick={() => removeParticipant(participant.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {bill.participants.length === 0 && (
          <p className="text-gray-500 text-sm">No participants added yet.</p>
        )}
      </div>
    </div>
  );
}
