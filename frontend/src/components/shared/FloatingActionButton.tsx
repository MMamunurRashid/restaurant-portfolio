import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingActionButton({ whatsappLink }: { whatsappLink: string }) {
    const message = "Hello! I would like to know more about your projects.";


    const handleClick = () => {
        const url = `${whatsappLink}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-5 right-6 z-100 group">
            <span className="whitespace-nowrap absolute right-16 bottom-3 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                Chat with us
            </span>

            <button
                onClick={handleClick}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Contact on WhatsApp"
            >
                <FaWhatsapp size={32} />
            </button>
        </div>
    );
};
