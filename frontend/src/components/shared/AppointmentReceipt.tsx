import { useRef } from 'react';
import { CheckCircle, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { IAppointment } from '@/interface/appointmentInterface';

interface AppointmentReceiptProps {
    appointment: IAppointment;
    open: boolean;
    onClose: () => void;
}

export default function AppointmentReceipt({ appointment, open, onClose }: AppointmentReceiptProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const date = appointment.date
        ? new Date(appointment.date).toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '—';

    const refId =
        appointment.reservationCode ||
        (appointment._id ? `RES-${appointment._id.slice(-6).toUpperCase()}` : 'RES-XXXXXX');

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
            pdf.save(`reservation-${refId}.pdf`);
        } catch (err) {
            
            console.error('Failed to generate PDF', err);
            const msg = (err && ((err as any).message || String(err))) || '';
            // Fallback for html2canvas parsing errors (e.g. unsupported color functions like oklab)
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
                    const extraStyles = `<style>body{background:var(--background);color:var(--foreground);font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;margin:0;padding:20px;} .receipt-root{max-width:800px;margin:0 auto;}</style>`;
                    printWindow.document.open();
                    printWindow.document.write(`<!doctype html><html><head>${headHTML}${extraStyles}</head><body><div class="receipt-root">${bodyHTML}</div></body></html>`);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                    return;
                } catch (printErr) {                    
                    console.error('Fallback print failed', printErr);
                    toast.error('Failed to generate PDF and fallback print failed. See console.');
                    return;
                }
            }

            toast.error('Failed to generate PDF. See console for details.');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Receipt modal — max-w-lg for extra width */}
                    <motion.div
                        className="relative z-10 w-full max-w-lg flex flex-col max-h-[90vh] rounded-[22px] bg-white shadow-2xl shadow-black/20 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.93, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3.5 right-3.5 z-20 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        {/* ── Scrollable body ── */}
                        <div className="overflow-y-auto flex-1">
                            {/* Printable section — captured by html2canvas */}
                            <div ref={printRef} className="bg-white">
                                {/* Brand header */}
                                <div className="bg-primary px-8 pt-8 pb-10 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                        <CheckCircle size={24} className="text-white" />
                                    </div>
                                    <h2 className="font-serif text-[24px] font-normal text-white leading-snug">
                                        Reservation Request Received
                                    </h2>
                                    <p className="mt-1 text-xs text-white/70 tracking-wide">
                                        We'll call you within 24 hours to confirm your slot.
                                    </p>
                                </div>

                                {/* Zigzag tear */}
                                <ZigZag />

                                {/* Personal details */}
                                <div className="px-4 md:px-8 pt-2 pb-5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">
                                        Your Details
                                    </p>
                                    <ReceiptRow label="Name" value={appointment.name} />
                                    <ReceiptRow label="Phone" value={appointment.phone} />
                                    {appointment.email && (
                                        <ReceiptRow label="Email" value={appointment.email} />
                                    )}
                                    <ReceiptRow label="Date" value={date} />
                                    {appointment.time && (
                                        <ReceiptRow label="Time" value={formatTime(appointment.time)} />
                                    )}
                                    {appointment.guestCount && (
                                        <ReceiptRow label="Guests" value={String(appointment.guestCount)} />
                                    )}
                                    {appointment.address && (
                                        <ReceiptRow label="Address" value={appointment.address} />
                                    )}
                                </div>

                                {/* ── Package price table ── */}
                                {appointment.packages && appointment.packages.length > 0 && (
                                    <div className="px-4 md:px-8 pb-5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">
                                        Dining Packages & Pricing
                                        </p>
                                        <div className="w-full border border-stone-200 rounded-xl overflow-hidden">
                                            {/* Table head */}
                                            <div className="grid grid-cols-[1fr_auto] bg-stone-50 px-4 py-2 border-b border-stone-200">
                                                <span className="text-[11px] font-semibold text-stone-500">
                                                    Package
                                                </span>
                                                <span className="text-[11px] font-semibold text-stone-500 text-right">
                                                    Price
                                                </span>
                                            </div>
                                            {/* Package rows */}
                                            {appointment.packages.map((pkg, i) => (
                                                <div
                                                    key={pkg._id}
                                                    className={`grid grid-cols-[1fr_auto] px-4 py-3 ${
                                                        i < appointment.packages!.length - 1
                                                            ? 'border-b border-stone-100'
                                                            : ''
                                                    }`}
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[13px] font-medium text-stone-700">
                                                            {pkg.title}
                                                        </span>
                                                        {(pkg.isPopular || pkg.isFeatured) && (
                                                            <div className="flex gap-1">
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
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-primary self-center">
                                                        {pkg.price !== undefined
                                                            ? `৳${pkg.price.toLocaleString('en-BD')}`
                                                            : '—'}
                                                    </span>
                                                </div>
                                            ))}
                                            {/* Total row */}
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
                                    <div className="mx-4 md:mx-8 mb-5 rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-1.5">
                                            Notes
                                        </p>
                                        <p className="text-xs text-stone-500 leading-relaxed italic">
                                            "{appointment.notes}"
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="border-t border-dashed border-stone-200 mx-4 md:mx-8" />
                                <div className="px-4 md:px-8 py-5 text-center space-y-1.5">
                                    <p className="text-[11px] text-stone-400 leading-relaxed">
                                        Please keep your phone reachable. Our team will confirm your reservation shortly.
                                    </p>
                                    <p className="font-mono text-[11px] text-stone-300 tracking-wider">
                                        REF · {refId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Sticky download button ── */}
                        <div className="shrink-0 border-t border-stone-100 px-8 py-4 bg-white">
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm shadow-primary/20"
                            >
                                <Download size={15} />
                                Download Receipt as PDF
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── Helpers ──

function ReceiptRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between py-2 border-b border-stone-100 last:border-none gap-4">
            <span className="text-xs text-stone-400 shrink-0">{label}</span>
            <span className="text-[13px] font-medium text-stone-700 text-right">{value}</span>
        </div>
    );
}

function ZigZag() {
    return (
        <svg
            viewBox="0 0 500 16"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-4 block"
        >
            <path
                d="M0,0 L20,16 L40,0 L60,16 L80,0 L100,16 L120,0 L140,16 L160,0 L180,16 L200,0 L220,16 L240,0 L260,16 L280,0 L300,16 L320,0 L340,16 L360,0 L380,16 L400,0 L420,16 L440,0 L460,16 L480,0 L500,16 L500,16 L0,16 Z"
                fill="var(--background)"
            />
        </svg>
    );
}

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}
