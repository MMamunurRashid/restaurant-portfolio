import React, { useRef } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, StickyNote, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import type { IAppointment } from '@/interface/appointmentInterface';


interface AdminAppointmentReceiptProps {
    appointment: IAppointment;
    status?: 'pending' | 'confirmed' | 'cancelled';
    /** Optional: wrap in a fixed-height scrollable container. Default true. */
    scrollable?: boolean;
}

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        className: 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/10',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10',
    },
};

export default function AdminAppointmentReceipt({
    appointment,
    status = 'pending',
    scrollable = true,
}: AdminAppointmentReceiptProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const initials = appointment.name
        ? appointment.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : '??';

    const date = appointment.date
        ? new Date(appointment.date).toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '—';

    const refId = appointment._id
        ? `RES-${appointment._id.slice(-6).toUpperCase()}`
        : 'RES-XXXXXX';

    const statusConfig = STATUS_CONFIG[status];

    const totalPrice =
        appointment.packages?.reduce((sum, pkg) => sum + (pkg.price ?? 0), 0) ?? 0;

    const handleDownload = async () => {
        const el = printRef.current;
        if (!el) {
            toast.error('Printable content not found');
            return;
        }

        try {
            const [hcModule, pdfModule] = await Promise.all([import('html2canvas'), import('jspdf')]);
            const html2canvas = (hcModule && (hcModule.default || hcModule)) as any;
            const jspdfImported = (pdfModule && (pdfModule.jsPDF || pdfModule.default || pdfModule)) as any;
            const PDFConstructor = jspdfImported && (jspdfImported.jsPDF || jspdfImported.default || jspdfImported);

            if (!html2canvas || !PDFConstructor) throw new Error('PDF libraries not available');

            const canvas = await html2canvas(el as HTMLElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || 'white',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new PDFConstructor({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = (canvas.height * pdfW) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
            pdf.save(`admin-receipt-${refId}.pdf`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate PDF', err);
            const msg = (err && ((err as any).message || String(err))) || '';
            if (msg.toLowerCase().includes('oklab') || msg.toLowerCase().includes('unsupported color') || msg.toLowerCase().includes('attempting to parse')) {
                toast('PDF renderer failed due to modern CSS color; falling back to Print dialog (Save as PDF)', { icon: 'ℹ️' });
                try {
                    const printWindow = window.open('', '_blank', 'width=900,height=900');
                    if (!printWindow) {
                        toast.error('Unable to open print window');
                        return;
                    }
                    const headHTML = document.head.innerHTML.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
                    const bodyHTML = el.outerHTML;
                    const extraStyles = `<style>body{background:var(--background);color:var(--foreground);font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;margin:0;padding:20px;} .receipt-root{max-width:900px;margin:0 auto;}</style>`;
                    printWindow.document.open();
                    printWindow.document.write(`<!doctype html><html><head>${headHTML}${extraStyles}</head><body><div class="receipt-root">${bodyHTML}</div></body></html>`);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                    return;
                } catch (printErr) {
                    // eslint-disable-next-line no-console
                    console.error('Fallback print failed', printErr);
                    toast.error('Failed to generate PDF and fallback print failed. See console.');
                    return;
                }
            }

            toast.error('Failed to generate PDF. See console for details.');
        }
    };

    return (
        /* max-w-2xl for a wider card */
        <Card className="w-full max-w-2xl overflow-hidden rounded-2xl border-stone-100 bg-white shadow-sm flex flex-col">

            {/* ── Scrollable content ── */}
            <div
                className={
                    scrollable
                        ? 'overflow-y-auto flex-1 max-h-[70vh]'
                        : 'flex-1'
                }
            >
                <div ref={printRef} className="bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                                {initials}
                            </div>
                            <div>
                                <p className="text-[15px] font-semibold text-stone-800 leading-tight">
                                    {appointment.name}
                                </p>
                                <p className="text-[11px] text-stone-400 font-mono tracking-wide">
                                    {refId}
                                </p>
                            </div>
                        </div>
                        <Badge
                            className={`text-[11px] font-semibold shadow-none rounded-full px-3 ${statusConfig.className}`}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {/* Info grid — 2-col on wide card */}
                    <div className="grid grid-cols-2 divide-x divide-stone-100">
                        <InfoCell icon={<Phone size={13} />} label="Phone" value={appointment.phone} />
                        <InfoCell
                            icon={<Mail size={13} />}
                            label="Email"
                            value={appointment.email || '—'}
                        />
                        <InfoCell
                            icon={<Calendar size={13} />}
                            label="Date"
                            value={date}
                            bottomBorder
                        />
                        <InfoCell
                            icon={<Clock size={13} />}
                            label="Time"
                            value={appointment.time ? formatTime(appointment.time) : '—'}
                            bottomBorder
                        />
                    </div>

                    {/* Address — full width */}
                    {appointment.address && (
                        <div className="px-6 py-3 border-b border-stone-100">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                                <MapPin size={10} />
                                Address
                            </div>
                            <p className="text-[13px] font-medium text-stone-700">
                                {appointment.address}
                            </p>
                        </div>
                    )}

                    {/* ── Package price table ── */}
                    {appointment.packages && appointment.packages.length > 0 && (
                        <div className="px-6 py-4 border-b border-stone-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">
                                Dining Packages & Pricing
                            </p>
                            <div className="w-full border border-stone-200 rounded-xl overflow-hidden">
                                {/* Table head */}
                                <div className="grid grid-cols-[1fr_120px_auto] bg-stone-50 px-4 py-2 border-b border-stone-200 gap-4">
                                    <span className="text-[11px] font-semibold text-stone-500">
                                        Package
                                    </span>
                                    <span className="text-[11px] font-semibold text-stone-500 text-center">
                                        Tags
                                    </span>
                                    <span className="text-[11px] font-semibold text-stone-500 text-right">
                                        Price
                                    </span>
                                </div>

                                {/* Package rows */}
                                {appointment.packages.map((pkg, i) => (
                                    <div
                                        key={pkg._id}
                                        className={`grid grid-cols-[1fr_120px_auto] px-4 py-3 gap-4 items-center ${
                                            i < appointment.packages!.length - 1
                                                ? 'border-b border-stone-100'
                                                : ''
                                        }`}
                                    >
                                        <span className="text-[13px] font-medium text-stone-700">
                                            {pkg.title}
                                        </span>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {pkg.isPopular && (
                                                <span className="text-[9px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                            {pkg.isFeatured && (
                                                <span className="text-[9px] font-bold uppercase tracking-wide bg-secondary/10 text-secondary border border-secondary/20 px-1.5 py-0.5 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                            {!pkg.isPopular && !pkg.isFeatured && (
                                                <span className="text-[11px] text-stone-300">—</span>
                                            )}
                                        </div>
                                        <span className="text-[14px] font-semibold text-primary text-right">
                                            {pkg.price !== undefined
                                                ? `৳${pkg.price.toLocaleString('en-BD')}`
                                                : '—'}
                                        </span>
                                    </div>
                                ))}

                                {/* Total */}
                                {totalPrice > 0 && (
                                    <div className="grid grid-cols-[1fr_auto] px-4 py-3 bg-primary/5 border-t border-primary/20">
                                        <span className="text-[13px] font-semibold text-stone-600">
                                            Estimated Total
                                        </span>
                                        <span className="text-[15px] font-bold text-primary">
                                            ৳{totalPrice.toLocaleString('en-BD')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">
                                <StickyNote size={10} />
                                Notes from customer
                            </div>
                            <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                                <p className="text-xs text-stone-500 leading-relaxed italic">
                                    "{appointment.notes}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Sticky download footer ── */}
            <div className="shrink-0 border-t border-stone-100 px-6 py-4 bg-white">
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2.5 border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98] text-sm font-semibold py-2.5 rounded-xl transition-all duration-200"
                >
                    <Download size={15} />
                    Download as PDF
                </button>
            </div>
        </Card>
    );
}

// ── Sub-components ──

function InfoCell({
    icon,
    label,
    value,
    bottomBorder = true,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    bottomBorder?: boolean;
}) {
    return (
        <div className={`px-6 py-3 ${bottomBorder ? 'border-b border-stone-100' : ''}`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                {icon}
                {label}
            </div>
            <p className="text-[13px] font-medium text-stone-700 truncate">{value}</p>
        </div>
    );
}

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}
