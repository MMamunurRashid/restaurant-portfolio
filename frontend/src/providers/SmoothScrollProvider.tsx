import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom"; // এটি যোগ করুন

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation(); // কারেন্ট পাথ ট্র্যাক করার জন্য
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {

        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [pathname]);

    return <>{children}</>;
}