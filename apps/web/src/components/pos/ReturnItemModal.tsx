'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/lib/currency';

interface ReturnItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    quantity: number;
    price: number | string;
    tableOrRoom?: string;
  } | null;
  onSubmit: (data: { itemId: string; reason: string; quantity: number; note: string }) => Promise<void>;
  isSubmitting?: boolean;
}

const PRESET_REASONS = [
  'Wrong item served / Order mixup',
  'Food quality issue / Cold / Incorrect temperature',
  'Customer changed mind / Left table',
  'Defective / Spilled / Contaminated',
  'Duplicate item / Waiter billing error',
  'Customer dissatisfied with taste',
  'Other reason'
];

export default function ReturnItemModal({
  isOpen,
  onClose,
  item,
  onSubmit,
  isSubmitting = false
}: ReturnItemModalProps) {
  const { format } = useCurrency();
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (isOpen && item) {
      setSelectedReason(PRESET_REASONS[0]);
      setQuantity(item.quantity || 1);
      setNote('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      itemId: item.id,
      reason: selectedReason,
      quantity: Math.min(Math.max(1, quantity), item.quantity),
      note: note.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl p-6 text-white overflow-hidden relative"
        style={{ border: '1px solid hsl(43, 96%, 56%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-5">
          <div>
            <h3 className="text-xl font-bold text-amber-400">Request Item Return</h3>
            <p className="text-xs text-slate-400 mt-1">Specify return details for management review & approval</p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Item Details Summary */}
        <div className="bg-slate-800/80 rounded-xl p-4 mb-5 border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-base font-semibold text-white">{item.name}</div>
              {item.tableOrRoom && (
                <div className="text-xs text-amber-400/90 mt-0.5 font-medium">{item.tableOrRoom}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-emerald-400">{format(Number(item.price))} each</div>
              <div className="text-xs text-slate-400">Ordered: {item.quantity}x</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Quantity to Return
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={quantity <= 1 || isSubmitting}
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-lg"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={item.quantity}
                value={quantity}
                onChange={e => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(Math.max(1, val), item.quantity));
                }}
                disabled={isSubmitting}
                className="w-20 h-10 text-center bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-lg focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                disabled={quantity >= item.quantity || isSubmitting}
                onClick={() => setQuantity(prev => Math.min(item.quantity, prev + 1))}
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-lg"
              >
                +
              </button>
              <span className="text-xs text-slate-400 ml-2">
                Total Refund: <strong className="text-emerald-400">{format(Number(item.price) * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Reason for Return *
            </label>
            <select
              value={selectedReason}
              onChange={e => setSelectedReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-400"
            >
              {PRESET_REASONS.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Additional Details / Staff Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Customer took one sip and requested something else, or food sent back cold..."
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-slate-700/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-rose-900/40 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
