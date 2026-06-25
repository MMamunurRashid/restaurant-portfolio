import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LayoutDashboard, Settings, X, ChevronDown, UserCog, Search, Heart, ChefHat, UtensilsCrossed,
    Newspaper,
    NotebookPen,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useGetGeneralSettingQuery } from '@/redux/features/generalSetting/generalSettingApi';
import { getMediaUrl } from '@/utils/media';

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
    const generalSetting = data?.data || {};
    const logoSrc = generalSetting?.logo ? getMediaUrl(generalSetting.logo) : '';

    // 1. Move isUrlActive to the top (Before useMemo)
    const isUrlActive = useCallback((item: MenuItem): boolean => {
        if (item.href === pathname) return true;
        // eslint-disable-next-line react-hooks/immutability
        if (item.children) return item.children.some(child => isUrlActive(child));
        return false;
    }, [pathname]);

    const menuItems: MenuItem[] = useMemo(() => [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: UtensilsCrossed, label: 'Menu Items', href: '/admin/services/all' },
        { icon: NotebookPen, label: 'Dining Packages', href: '/admin/packages/all' },
        {
            icon: ChefHat,
            label: 'Restaurant Profile',
            children: [
                { label: 'About Restaurant', href: '/admin/about' },
                { label: 'Team Categories', href: '/admin/about/team/category/all' },
                { label: 'Team Members', href: '/admin/about/team/all' },
                { label: 'Reservation Rules', href: '/admin/setting/reservation' },
                { label: 'Dining Tables', href: '/admin/setting/tables' },
            ]
        },
        {
            icon: Heart,
            label: 'Guest Requests',
            children: [
                { label: "Restaurant Contact", href: "/admin/contact-us" },
                { label: 'Messages', href: "/admin/contact-message" },
                { label: 'Table Reservations', href: "/admin/appointments/all" },
            ]
        },

        {
            icon: Settings,
            label: 'Settings',
            children: [
                { label: 'General Info', href: '/admin/setting/general' },
                { label: 'Hero Banners', href: '/admin/setting/banner/all' },
                { label: 'Special Offer', href: '/admin/setting/campaign-banner' },
                { label: 'Testimonials', href: '/admin/setting/testimonials/all' },
                { label: 'Gallery', href: '/admin/setting/gallery/all' },                
                { label: 'SMTP Mail', href: '/admin/setting/smtp' },
                { label: 'Privacy Policy', href: "/admin/privacy-policy" },
                { label: 'Terms & Conditions', href: "/admin/terms-conditions" },
            ]
        },
        { icon: Newspaper, label: 'Journal', href: '/admin/blogs/all' },
        { icon: UserCog, label: 'Admin Users', href: '/admin/user/all' },
        { icon: Search, label: 'SEO & Marketing', href: "/admin/seo" },
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
                        ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
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

                {/* Cafe & Restaurant Logo Section */}
                <div className="p-6 flex items-center justify-between lg:justify-center shrink-0 bg-white">
                    {(logoSrc || generalSetting?.siteName) && (
                        <Link to="/admin/dashboard">
                            {logoSrc ? (
                                <img src={logoSrc} alt={generalSetting?.siteName || 'logo'} className='w-18 mx-auto' loading='lazy' />
                            ) : (
                                <span className="font-serif text-xl font-semibold text-slate-900">{generalSetting.siteName}</span>
                            )}
                        </Link>
                    )}
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
