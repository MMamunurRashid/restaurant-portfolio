import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LayoutDashboard, Settings, X, ChevronDown, UserCog, ShieldCheck, Search,
    FileText, Heart, Flower2, Scissors,
    Newspaper,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CONFIG } from '@/config';
import { useGetGeneralSettingQuery } from '@/redux/features/generalSetting/generalSettingApi';

interface MenuItem {
    icon?: any;
    label: string;
    href?: string;
    children?: MenuItem[];
}

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { pathname } = useLocation();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const { data } = useGetGeneralSettingQuery({});
    const logo = data?.data?.logo;

    // 1. Move isUrlActive to the top (Before useMemo)
    const isUrlActive = useCallback((item: MenuItem): boolean => {
        if (item.href === pathname) return true;
        // eslint-disable-next-line react-hooks/immutability
        if (item.children) return item.children.some(child => isUrlActive(child));
        return false;
    }, [pathname]);

    const menuItems: MenuItem[] = useMemo(() => [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Scissors, label: 'Our Services', href: '/admin/services/all' },
        {
            icon: Flower2,
            label: 'Salon & Spa',
            children: [
                { label: 'About Studio', href: '/admin/about' },
                { label: 'Specialists Category', href: '/admin/about/team/category/all' },
                { label: 'Beauty Experts', href: '/admin/about/team/all' },
            ]
        },
        {
            icon: Heart,
            label: 'Client Inquiry',
            children: [
                { label: "Salon Contact", href: "/admin/contact-us" },
                { label: 'Messages', href: "/admin/contact-message" },
                { label: 'Bookings', href: "/admin/appointments/all" },
            ]
        },
        { icon: ShieldCheck, label: 'Privacy Policy', href: "/admin/privacy-policy" },
        { icon: FileText, label: 'Terms & Conditions', href: "/admin/terms-conditions" },
        {
            icon: Settings,
            label: 'Salon Settings',
            children: [
                { label: 'General Info', href: '/admin/setting/general' },
                { label: 'Hero Banners', href: '/admin/setting/banner/all' },
                { label: 'Promotional', href: '/admin/setting/campaign-banner' },
                { label: 'Testimonials', href: '/admin/setting/testimonials/all' },
            ]
        },
        { icon: Newspaper, label: 'Blogs', href: '/admin/blogs/all' },
        { icon: UserCog, label: 'Staff Management', href: '/admin/user/all' },
        { icon: Search, label: 'SEO Marketing', href: "/admin/seo" },
    ], []);

    useEffect(() => {
        const opened: string[] = [];
        const findAndOpen = (items: MenuItem[]) => {
            items.forEach(item => {
                if (item.children && isUrlActive(item)) {
                    opened.push(item.label);
                    findAndOpen(item.children);
                }
            });
        };
        findAndOpen(menuItems);
        setOpenMenus(prev => Array.from(new Set([...prev, ...opened])));
    }, [pathname, menuItems, isUrlActive]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
    };

    const NavItem = ({ item }: { item: MenuItem }) => {
        const hasChildren = !!item.children;
        const isOpenMenu = openMenus.includes(item.label);
        const isActive = isUrlActive(item);

        return (
            <div className="w-full mb-1.5">
                {hasChildren ? (
                    <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center gap-4 py-3.5 px-5 rounded-2xl transition-all duration-300 group
                        ${isActive ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
                    >
                        {item.icon && <item.icon size={20} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} />}
                        <span className={`flex-1 text-left font-bold text-[14.5px] tracking-wide`}>{item.label}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpenMenu ? 'rotate-180 text-primary' : 'text-slate-300'}`} />
                    </button>
                ) : (
                    <Link
                        to={item.href || '#'}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 py-3.5 px-5 rounded-2xl transition-all duration-300 group
                        ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
                    >
                        {item.icon && <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />}
                        <span className={`flex-1 text-left font-bold text-[14.5px] tracking-wide`}>{item.label}</span>
                    </Link>
                )}

                {hasChildren && (
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpenMenu ? 'max-h-150 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-8 border-l-2 border-slate-100 pl-4 space-y-1">
                            {item.children?.map((child, idx) => (
                                <Link
                                    key={idx}
                                    to={child.href || '#'}
                                    className={`block py-2.5 text-[13.5px] font-semibold transition-colors ${pathname === child.href ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

            <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-100 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Salon Logo Section */}
                <div className="p-6 flex items-center justify-between lg:justify-center shrink-0 bg-white">
                    <Link to="/admin/dashboard">
                        <img src={CONFIG.BASE_URL + logo || "/images/logo.png"} alt="logo" className='w-18 mx-auto' loading='lazy' />
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-300 hover:text-primary p-1 transition-colors"><X size={24} /></button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-6 py-2 no-scrollbar">
                    <nav className="space-y-1 pb-8">
                        {menuItems.map((item, index) => (
                            <NavItem key={index} item={item} />
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}