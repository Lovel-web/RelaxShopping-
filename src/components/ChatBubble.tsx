// ✅ src/components/ChatBubble.tsx
import React from "react";

type ChatBubbleProps = {
  text: string;
  sender: string;
  senderRole?: string;
  isOwn: boolean;
  timestamp?: string;
};

export default function ChatBubble({
  text,
  sender,
  senderRole,
  isOwn,
  timestamp,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex flex-col mb-3 ${
        isOwn ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <div
        className={`px-3 py-2 rounded-2xl max-w-[80%] shadow-sm ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm font-medium">{text}</p>
      </div>
      <span className="text-[10px] text-gray-400 mt-1">
        {isOwn ? "You" : `${senderRole || "User"}: ${sender}`} · {timestamp}
      </span>
    </div>
  );
}
