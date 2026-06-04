import { useState, useEffect } from 'react';

export default function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobile = () => setIsOpen(!isOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const closeMobile = () => setIsOpen(false);

    return { isOpen, isCollapsed, toggleMobile, toggleCollapse, closeMobile };
}