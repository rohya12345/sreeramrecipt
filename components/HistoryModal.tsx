
import React from 'react';
import { ReceiptData } from '../types';

interface HistoryModalProps {
  history: ReceiptData[];
  onClose: () => void;
  onLoad: (receipt: ReceiptData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose, onLoad }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in fade-in duration-300">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Receipt History</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">&times; Close</button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No saved receipts found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-2">Receipt No</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Date</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.sort((a,b) => b.createdAt - a.createdAt).map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-2 font-mono text-blue-600">{r.receiptNo}</td>
                    <td className="p-2">{r.receivedFrom || "N/A"}</td>
                    <td className="p-2">{r.date}</td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={() => onLoad(r)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
