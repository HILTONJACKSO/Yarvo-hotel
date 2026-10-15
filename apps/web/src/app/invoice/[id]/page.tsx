'use client';

import { useState, useEffect, use } from 'react';
import {
  ReceiptInvoiceSettings,
  getDefaultReceiptInvoiceSettings
} from '@/lib/receipt-invoice-helper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type FolioLineItem = {
  id: string;
  type: 'CHARGE' | 'PAYMENT' | 'ADJUSTMENT';
  category: string;
  amount: string | number;
  description: string;
  createdAt: string;
};

type Folio = {
  id: string;
  balance: number;
  status: string;
  reservation: {
    confirmationCode: string;
    checkInDate: string;
    checkOutDate: string;
    guest: { firstName: string; lastName: string; email?: string; phone?: string; address?: string };
    room: { number: string } | null;
  };
  lineItems: FolioLineItem[];
};

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [folio, setFolio] = useState<Folio | null>(null);
  const [settings, setSettings] = useState<ReceiptInvoiceSettings>(getDefaultReceiptInvoiceSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property for customized receipt & invoice settings
        const propRes = await fetch(`${API_URL}/api/v1/properties`, { credentials: 'include' });
        if (propRes.ok) {
          const propData = await propRes.json();
          const property = Array.isArray(propData) ? propData[0] : (propData.data || propData);
          if (property) {
            setSettings(getDefaultReceiptInvoiceSettings(property));
          }
        }

        // Fetch folio statement
        const folioRes = await fetch(`${API_URL}/api/v1/folios/${resolvedParams.id}/statement`, { credentials: 'include' });
        if (folioRes.ok) {
          const folioData = await folioRes.json();
          setFolio(folioData.data || folioData);
        }
      } catch (err) {
        console.error('Error fetching folio invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Invoice...</div>;
  if (!folio) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Folio invoice not found.</div>;

  const totalCharges = folio.lineItems.filter(i => i.type === 'CHARGE').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const subtotal = totalCharges;
  const gst = totalCharges - (totalCharges / 1.10);
  const totalPayments = folio.lineItems.filter(i => i.type === 'PAYMENT').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const invoiceTitle = settings.invoice.title || 'GUEST FOLIO INVOICE';
  const invoicePrefix = settings.invoice.prefix || 'INV-';

  return (
    <div className="invoice-container">
      <div className="no-print print-actions">
        <button onClick={() => window.print()} className="btn-print">🖨️ Print Invoice</button>
      </div>

      <div className="invoice-paper">
        {/* Header */}
        <div className="invoice-header">
          <div>
            {settings.showLogo && settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo" className="invoice-logo" />
            )}
            <h2 className="invoice-brand">{settings.businessName}</h2>
            {settings.tagline && <p className="invoice-tagline">{settings.tagline}</p>}
            {settings.address && <p className="invoice-info">{settings.address}</p>}
            {settings.phone && <p className="invoice-info">Phone: {settings.phone}</p>}
            {settings.email && <p className="invoice-info">Email: {settings.email}</p>}
            {settings.website && <p className="invoice-info">Web: {settings.website}</p>}
            {settings.taxNumber && <p className="tax-number">Tax ID / TIN: {settings.taxNumber}</p>}
          </div>

          <div className="invoice-heading-block">
            <h1 className="doc-title">{invoiceTitle}</h1>
            <span className="doc-badge">#{invoicePrefix}{folio.id.split('-')[0].toUpperCase()}</span>
            <p className="invoice-date">Date: <strong>{new Date().toLocaleDateString()}</strong></p>
            {settings.invoice.showDueDate && (
              <p className="invoice-due">Due: <strong>Upon Receipt</strong></p>
            )}
          </div>
        </div>

        {settings.invoice.headerNote && (
          <div className="header-note-banner">
            {settings.invoice.headerNote}
          </div>
        )}

        <hr className="divider" />

        {/* Guest & Invoice Meta */}
        <div className="invoice-meta">
          <div className="meta-left">
            <h3>Billed To (Guest):</h3>
            <p className="guest-name">{folio.reservation.guest.firstName} {folio.reservation.guest.lastName}</p>
            {folio.reservation.guest.email && <p>{folio.reservation.guest.email}</p>}
            {folio.reservation.guest.phone && <p>{folio.reservation.guest.phone}</p>}
            {folio.reservation.guest.address && <p>{folio.reservation.guest.address}</p>}
          </div>
          <div className="meta-right">
            <h3>Reservation Details:</h3>
            <table className="meta-table">
              <tbody>
                <tr>
                  <td>Confirmation:</td>
                  <td><strong>{folio.reservation.confirmationCode || folio.id.substring(0, 8).toUpperCase()}</strong></td>
                </tr>
                <tr>
                  <td>Assigned Unit:</td>
                  <td>{folio.reservation.room ? `Room ${folio.reservation.room.number}` : 'Unassigned / Non-Room'}</td>
                </tr>
                <tr>
                  <td>Check-In:</td>
                  <td>{new Date(folio.reservation.checkInDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Check-Out:</td>
                  <td>{new Date(folio.reservation.checkOutDate).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Items */}
        <div className="invoice-body">
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Date</th>
                <th>Description / Service</th>
                <th className="amount-col">Charges</th>
                <th className="amount-col">Credits / Paid</th>
              </tr>
            </thead>
            <tbody>
              {folio.lineItems.map(item => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{item.description}</span>
                    {item.category && <span className="cat-pill">{item.category}</span>}
                  </td>
                  <td className="amount-col">{item.type === 'CHARGE' ? `$${Number(item.amount).toFixed(2)}` : ''}</td>
                  <td className="amount-col" style={{ color: item.type === 'PAYMENT' ? '#16a34a' : undefined }}>
                    {item.type === 'PAYMENT' ? `$${Number(item.amount).toFixed(2)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="invoice-summary">
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Taxes & Fees (10% Included):</td>
                <td>${gst.toFixed(2)}</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>Total Charges:</td>
                <td>${totalCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Payments:</td>
                <td style={{ color: '#16a34a' }}>-${totalPayments.toFixed(2)}</td>
              </tr>
              <tr className="balance-row">
                <td>Balance Due:</td>
                <td style={{ color: Number(folio.balance) <= 0 ? '#16a34a' : '#b91c1c' }}>
                  ${Number(folio.balance).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Instructions & Terms */}
        <div className="invoice-bottom-grid">
          <div>
            {settings.invoice.showPaymentInstructions && settings.invoice.bankDetails && (
              <div className="bank-box">
                <h4>Payment Instructions & Bank Wire</h4>
                <p>{settings.invoice.bankDetails}</p>
              </div>
            )}

            {settings.invoice.terms && (
              <div className="terms-section">
                <h4>Terms & Conditions</h4>
                <p>{settings.invoice.terms}</p>
              </div>
            )}
          </div>

          <div className="signature-col">
            {settings.invoice.showSignatureLine && (
              <div className="signature-line">
                Guest / Client Signature & Date
              </div>
            )}
            {settings.invoice.footerNote && (
              <p className="footer-note-text">
                {settings.invoice.footerNote}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        body { background: #f1f5f9; margin: 0; color: #1e293b; font-family: 'Inter', -apple-system, sans-serif; }
        .invoice-container { padding: 40px; display: flex; flex-direction: column; align-items: center; }
        .invoice-paper { background: white; width: 100%; max-width: 840px; padding: 48px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); border-radius: 8px; }
        
        .print-actions { margin-bottom: 24px; }
        .btn-print { background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
        .btn-print:hover { background: #1e293b; }
        
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .invoice-logo { max-width: 160px; max-height: 70px; object-fit: contain; margin-bottom: 8px; display: block; }
        .invoice-brand { margin: 0 0 2px 0; font-size: 1.5rem; color: #0f172a; font-weight: 800; }
        .invoice-tagline { margin: 0 0 6px 0; font-size: 0.85rem; color: #64748b; font-style: italic; }
        .invoice-info { margin: 1px 0; color: #475569; font-size: 0.85rem; }
        .tax-number { margin: 4px 0 0 0; font-size: 0.85rem; font-weight: 700; color: #0f172a; }

        .invoice-heading-block { text-align: right; }
        .doc-title { margin: 0 0 4px 0; font-size: 1.75rem; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
        .doc-badge { display: inline-block; background: #0f172a; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.875rem; font-weight: 700; margin-bottom: 8px; }
        .invoice-date, .invoice-due { margin: 2px 0; font-size: 0.875rem; color: #64748b; }
        .invoice-date strong, .invoice-due strong { color: #0f172a; }

        .header-note-banner {
          background: #f8fafc;
          border-left: 4px solid #0f172a;
          padding: 8px 12px;
          margin-bottom: 20px;
          font-size: 0.85rem;
          color: #475569;
        }

        .divider { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0 30px 0; }
        
        .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8fafc; padding: 18px 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .meta-left h3, .meta-right h3 { margin: 0 0 8px 0; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
        .meta-left p { margin: 0 0 3px 0; font-size: 0.875rem; color: #334155; }
        .guest-name { font-weight: 700; font-size: 1.1rem !important; color: #0f172a; }
        
        .meta-table { border-collapse: collapse; font-size: 0.875rem; }
        .meta-table td { padding: 2px 10px 2px 0; }
        .meta-table td:first-child { color: #64748b; }
        .meta-table td:last-child { color: #0f172a; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .items-table th { background: #0f172a; color: white; padding: 10px 14px; text-align: left; font-size: 0.825rem; font-weight: 600; text-transform: uppercase; }
        .items-table td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
        .amount-col { text-align: right !important; }
        .cat-pill { display: inline-block; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; color: #64748b; margin-left: 8px; text-transform: uppercase; }
        
        .invoice-summary { display: flex; justify-content: flex-end; margin-bottom: 30px; }
        .summary-table { width: 320px; border-collapse: collapse; font-size: 0.9rem; }
        .summary-table td { padding: 6px 12px; }
        .summary-table td:last-child { text-align: right; font-weight: 600; }
        .balance-row td { border-top: 2px solid #0f172a; font-weight: 800; font-size: 1.15rem; padding-top: 10px; }
        
        .invoice-bottom-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 24px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
        .bank-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-bottom: 16px; }
        .bank-box h4 { margin: 0 0 6px 0; font-size: 0.8rem; text-transform: uppercase; color: #0f172a; font-weight: 700; }
        .bank-box p { margin: 0; font-size: 0.8rem; color: #475569; white-space: pre-line; line-height: 1.4; }
        
        .terms-section h4 { margin: 0 0 4px 0; font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; }
        .terms-section p { margin: 0; font-size: 0.75rem; color: #64748b; line-height: 1.4; white-space: pre-line; }

        .signature-col { display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; }
        .signature-line { border-top: 1px solid #0f172a; width: 180px; text-align: center; padding-top: 6px; font-size: 0.8rem; color: #475569; }
        .footer-note-text { margin-top: 14px; font-size: 0.8rem; color: #64748b; text-align: right; }
        
        @media print {
          body { background: white; }
          .invoice-container { padding: 0; }
          .invoice-paper { box-shadow: none; padding: 0; max-width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
