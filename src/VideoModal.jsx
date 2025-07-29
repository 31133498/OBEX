// components/VideoModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold text-cyan-400 mb-4">{event.type} — {new Date(event.timestamp).toLocaleString()}</h2>

        {/* Video playback */}
        {event.videoUrl ? (
          <video
            controls
            src={event.videoUrl}
            className="w-full max-h-[500px] rounded"
          />
        ) : (
          <div className="text-gray-400 text-center p-4 border border-gray-600 rounded">
            No video available for this event.
          </div>
        )}

        {/* Metadata */}
        <div className="mt-4 text-sm space-y-1">
          {event.cameraName && <div><strong>📍 Camera:</strong> {event.cameraName}</div>}
          {event.zone && <div><strong>📌 Zone:</strong> {event.zone}</div>}
          {event.alertLevel && <div><strong>⚠️ Alert:</strong> {event.alertLevel}</div>}
          {event.label && <div><strong>🧠 AI Tag:</strong> {event.label} ({event.confidence})</div>}
          {event.notes && <div><strong>📎 Notes:</strong> {event.notes}</div>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          {event.videoUrl && (
            <a
              href={event.videoUrl}
              download
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              ⬇️ Download Video
            </a>
          )}
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
