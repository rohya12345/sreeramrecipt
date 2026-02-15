
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ReceiptData, 
  ReceiptItem, 
  Purity, 
  ORNAMENT_LIST 
} from './types';
import { 
  COMPANY_NAME, 
  ADDRESS, 
  PHONES, 
  EMAIL_GST, 
  RATE_PER_PIECE, 
  MINIMUM_PAYABLE,
  TrashIcon 
} from './constants';
import { EditableDropdown } from './components/EditableDropdown';
import { HistoryModal } from './components/HistoryModal';

const generateId = () => Math.random().toString(36).substring(2, 9);
const getNextReceiptNo = (history: ReceiptData[]) => {
  if (history.length === 0) return "RC1";
  const nums = history
    .map(r => parseInt(r.receiptNo.replace('RC', '')))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `RC${max + 1}`;
};

const App: React.FC = () => {
  const [receipt, setReceipt] = useState<ReceiptData>({
    id: generateId(),
    receiptNo: "RC1",
    receivedFrom: "",
    bisCertificateNo: "",
    date: new Date().toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-GB'),
    dcNo: "BY HAND",
    dcDate: new Date().toLocaleDateString('en-GB'),
    items: Array.from({ length: 5 }, (_, i) => ({
      id: generateId(),
      description: "",
      qty: 0,
      customerGrossWeight: 0,
      customerNetWeight: 0,
      centreGrossWeight: 0,
      centreNetWeight: 0,
      declaredPurity: "",
      remarks: ""
    })),
    createdAt: Date.now()
  });

  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('sreeram_receipt_history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setReceipt(prev => ({ ...prev, receiptNo: getNextReceiptNo(parsed) }));
    }
  }, []);

  const totals = useMemo(() => {
    return receipt.items.reduce((acc, item) => ({
      qty: acc.qty + (Number(item.qty) || 0),
      custGross: acc.custGross + (Number(item.customerGrossWeight) || 0),
      custNet: acc.custNet + (Number(item.customerNetWeight) || 0),
      centreGross: acc.centreGross + (Number(item.centreGrossWeight) || 0),
      centreNet: acc.centreNet + (Number(item.centreNetWeight) || 0),
    }), { qty: 0, custGross: 0, custNet: 0, centreGross: 0, centreNet: 0 });
  }, [receipt.items]);

  const payableAmount = useMemo(() => {
    const calculated = totals.qty * RATE_PER_PIECE;
    return Math.max(calculated, MINIMUM_PAYABLE).toFixed(2);
  }, [totals.qty]);

  const handleItemChange = (itemId: string, field: keyof ReceiptItem, value: any) => {
    setReceipt(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
    }));
  };

  const addRow = () => {
    setReceipt(prev => ({
      ...prev,
      items: [...prev.items, {
        id: generateId(),
        description: "",
        qty: 0,
        customerGrossWeight: 0,
        customerNetWeight: 0,
        centreGrossWeight: 0,
        centreNetWeight: 0,
        declaredPurity: "",
        remarks: ""
      }]
    }));
  };

  const removeRow = (id: string) => {
    if (receipt.items.length <= 1) return;
    setReceipt(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const saveReceipt = () => {
    const newHistory = [...history.filter(h => h.id !== receipt.id), { ...receipt, createdAt: Date.now() }];
    setHistory(newHistory);
    localStorage.setItem('sreeram_receipt_history', JSON.stringify(newHistory));
    alert('Receipt Saved Successfully!');
  };

  const loadReceipt = (r: ReceiptData) => {
    setReceipt(r);
    setShowHistory(false);
  };

  const resetNew = () => {
    const nextNo = getNextReceiptNo(history);
    setReceipt({
      id: generateId(),
      receiptNo: nextNo,
      receivedFrom: "",
      bisCertificateNo: "",
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      dcNo: "BY HAND",
      dcDate: new Date().toLocaleDateString('en-GB'),
      items: Array.from({ length: 5 }, (_, i) => ({
        id: generateId(),
        description: "",
        qty: 0,
        customerGrossWeight: 0,
        customerNetWeight: 0,
        centreGrossWeight: 0,
        centreNetWeight: 0,
        declaredPurity: "",
        remarks: ""
      })),
      createdAt: Date.now()
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Receipt Container */}
      <div className="receipt-container w-full max-w-[800px] bg-white border-[2px] border-black shadow-lg relative overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gray-100 p-4 border-b border-black text-center">
          <h1 className="text-2xl font-bold tracking-tight uppercase">{COMPANY_NAME}</h1>
          <p className="text-[11px] leading-tight mt-1">{ADDRESS}</p>
          <p className="text-[11px] leading-tight">{PHONES}</p>
          <p className="text-[11px] leading-tight font-medium">{EMAIL_GST}</p>
          <div className="mt-3 py-1 border-t border-b border-gray-300">
            <h2 className="text-xl font-bold uppercase tracking-widest">Receipt / Collection Voucher</h2>
          </div>
        </header>

        {/* Receipt Details Section */}
        <div className="grid grid-cols-2 p-4 gap-4 text-xs border-b border-black">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-bold w-32 shrink-0">Received from M/s.:</span>
              <input 
                className="flex-1 border-b border-gray-300 outline-none p-0 bg-transparent focus:border-black transition-colors"
                value={receipt.receivedFrom}
                onChange={e => setReceipt({...receipt, receivedFrom: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div className="flex items-center">
              <span className="font-bold w-32 shrink-0">BIS Certificate No.:</span>
              <input 
                className="flex-1 border-b border-gray-300 outline-none p-0 bg-transparent focus:border-black transition-colors"
                value={receipt.bisCertificateNo}
                onChange={e => setReceipt({...receipt, bisCertificateNo: e.target.value})}
                placeholder="Enter BIS number"
              />
            </div>
          </div>
          <div className="space-y-2 border-l border-gray-200 pl-4">
            <div className="flex">
              <span className="font-bold w-24">Receipt No.:</span>
              <span className="font-mono text-blue-800 font-bold">{receipt.receiptNo}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-24">Date:</span>
              <span>{receipt.date}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-24">Time:</span>
              <span>{receipt.time}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-gray-50 border-b border-black text-[10px] italic">
          The following articles, as detailed below for hallmarking / assaying:
        </div>

        {/* Items Table Section */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border-b border-black text-[11px]">
            <thead>
              <tr className="bg-gray-100 uppercase font-bold text-center">
                <th className="border border-black px-1 py-1 w-8" rowSpan={2}>Sl. No.</th>
                <th className="border border-black px-2 py-1" rowSpan={2}>Descriptions</th>
                <th className="border border-black px-1 py-1 w-16" rowSpan={2}>Qty (Total Pcs.)</th>
                <th className="border border-black py-1" colSpan={2}>Weight of Customer</th>
                <th className="border border-black py-1" colSpan={2}>Weight of Centre</th>
                <th className="border border-black px-2 py-1" rowSpan={2}>Declared Purity</th>
                <th className="border border-black px-2 py-1" rowSpan={2}>Remarks</th>
                <th className="border border-black px-1 py-1 no-print w-8" rowSpan={2}></th>
              </tr>
              <tr className="bg-gray-100 text-[10px] text-center">
                <th className="border border-black px-1 py-1 w-14">Gross Wt.</th>
                <th className="border border-black px-1 py-1 w-14">Net Wt.</th>
                <th className="border border-black px-1 py-1 w-14">Gross Wt.</th>
                <th className="border border-black px-1 py-1 w-14">Net Wt.</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={item.id} className="text-center group">
                  <td className="border border-black py-1">{index + 1}</td>
                  <td className="border border-black py-1 px-1 min-w-[120px]">
                    <EditableDropdown 
                      value={item.description}
                      options={ORNAMENT_LIST}
                      onChange={(val) => handleItemChange(item.id, 'description', val)}
                      placeholder=""
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      type="number"
                      className="w-full text-center outline-none bg-transparent"
                      value={item.qty || ""}
                      onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      type="number" step="0.001"
                      className="w-full text-center outline-none bg-transparent"
                      value={item.customerGrossWeight || ""}
                      onChange={e => handleItemChange(item.id, 'customerGrossWeight', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      type="number" step="0.001"
                      className="w-full text-center outline-none bg-transparent"
                      value={item.customerNetWeight || ""}
                      onChange={e => handleItemChange(item.id, 'customerNetWeight', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      type="number" step="0.001"
                      className="w-full text-center outline-none bg-transparent"
                      value={item.centreGrossWeight || ""}
                      onChange={e => handleItemChange(item.id, 'centreGrossWeight', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      type="number" step="0.001"
                      className="w-full text-center outline-none bg-transparent"
                      value={item.centreNetWeight || ""}
                      onChange={e => handleItemChange(item.id, 'centreNetWeight', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1 min-w-[80px]">
                    <EditableDropdown 
                      value={item.declaredPurity}
                      options={Object.values(Purity)}
                      onChange={(val) => handleItemChange(item.id, 'declaredPurity', val)}
                      placeholder=""
                    />
                  </td>
                  <td className="border border-black py-1 px-1">
                    <input 
                      className="w-full text-left outline-none bg-transparent px-1"
                      value={item.remarks}
                      onChange={e => handleItemChange(item.id, 'remarks', e.target.value)}
                    />
                  </td>
                  <td className="border border-black py-1 px-1 no-print">
                    <button 
                      onClick={() => removeRow(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove row"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="font-bold bg-gray-50 text-center uppercase">
                <td className="border border-black py-2 px-1" colSpan={2}>Total</td>
                <td className="border border-black py-2 px-1">{totals.qty}</td>
                <td className="border border-black py-2 px-1">{totals.custGross.toFixed(3)}</td>
                <td className="border border-black py-2 px-1">{totals.custNet.toFixed(3)}</td>
                <td className="border border-black py-2 px-1">{totals.centreGross.toFixed(3)}</td>
                <td className="border border-black py-2 px-1">{totals.centreNet.toFixed(3)}</td>
                <td className="border border-black py-2 px-1" colSpan={2}></td>
                <td className="border border-black py-2 px-1 no-print"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Metadata Footer */}
        <div className="p-4 border-b border-black text-xs space-y-2">
          <div className="flex gap-8">
            <div className="flex">
              <span className="font-bold mr-2">Your D. C. No.:</span>
              <input 
                className="border-b border-gray-300 outline-none w-32 px-1 focus:border-black"
                value={receipt.dcNo}
                onChange={e => setReceipt({...receipt, dcNo: e.target.value})}
              />
            </div>
            <div className="flex">
              <span className="font-bold mr-2">Date:</span>
              <input 
                className="border-b border-gray-300 outline-none w-32 px-1 focus:border-black"
                value={receipt.dcDate}
                onChange={e => setReceipt({...receipt, dcDate: e.target.value})}
              />
            </div>
          </div>
          <p className="italic text-[10px] text-gray-600">I accept and are bound by all the 'Terms and Conditions' printed attached.</p>
        </div>

        {/* Payment Calculation Section */}
        <div className="p-4">
          <div className="bg-gray-100 p-6 border-2 border-dashed border-gray-400 rounded-lg text-center">
            <h3 className="text-gray-600 font-bold uppercase text-[11px] mb-2 tracking-widest">After Collecting the Article Payable Amount</h3>
            <div className="text-4xl font-black text-black">
              ₹{payableAmount}
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="p-4 grid grid-cols-2 mt-8 mb-4">
          <div className="text-center pt-8">
            <div className="w-48 mx-auto border-t border-gray-400 mt-4 mb-1"></div>
            <span className="text-[10px] text-gray-600">Customer's Signature</span>
          </div>
          <div className="text-center pt-8">
            <div className="w-48 mx-auto border-t border-gray-400 mt-4 mb-1"></div>
            <div className="text-[10px] font-bold uppercase leading-none">Authorized Signatory</div>
            <div className="text-[9px] text-gray-600 mt-1">{COMPANY_NAME}</div>
          </div>
        </div>

        {/* Jurisdictional Note */}
        <div className="text-center py-2 bg-gray-50 border-t border-black text-[9px] uppercase tracking-tighter">
          Note: Any dispute subject to SERAMPORE, HOOGHLY, (WEST BENGAL) jurisdiction only.
        </div>
      </div>

      {/* Action Buttons (No Print) */}
      <div className="no-print mt-8 mb-12 flex flex-wrap justify-center gap-3">
        <button 
          onClick={addRow}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-md transition-all active:scale-95"
        >
          Add Row
        </button>
        <button 
          onClick={resetNew}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow-md transition-all active:scale-95"
        >
          New Receipt
        </button>
        <button 
          onClick={saveReceipt}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-all active:scale-95"
        >
          Save Receipt
        </button>
        <button 
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md transition-all active:scale-95"
        >
          View Receipt History
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-2 rounded shadow-md transition-all active:scale-95 font-bold"
        >
          Print Receipt / Export PDF
        </button>
      </div>

      {/* History Modal */}
      {showHistory && (
        <HistoryModal 
          history={history} 
          onClose={() => setShowHistory(false)} 
          onLoad={loadReceipt} 
        />
      )}

      {/* Attribution */}
      <footer className="no-print text-gray-400 text-[10px] mb-8">
        SREERAM ASSAY & HALLMARKING CENTRE - Digital Receipt System
      </footer>
    </div>
  );
};

export default App;
