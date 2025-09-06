'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiBook,
    FiAward,
    FiUsers,
    FiBarChart2,
    FiSettings,
    FiChevronLeft,
    FiChevronRight,
    FiPlay,
    FiDollarSign,
} from 'react-icons/fi';
import { cn } from '@/utils/helpers';

interface SidebarProps {
    userType: 'student' | 'admin';
}

export function Sidebar({ userType }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const studentMenuItems = [
        { icon: FiHome, label: 'Dashboard', href: '/student/dashboard' },
        { icon: FiBook, label: 'My Courses', href: '/student/courses' },
        { icon: FiPlay, label: 'Live Classes', href: '/student/live-classes' },
        { icon: FiAward, label: 'Achievements', href: '/student/achievements' },
        { icon: FiUsers, label: 'Study Groups', href: '/student/groups' },
        { icon: FiBarChart2, label: 'Progress', href: '/student/progress' },
        { icon: FiDollarSign, label: 'Payments', href: '/student/payments' },
        { icon: FiSettings, label: 'Settings', href: '/student/settings' },
    ];

    const adminMenuItems = [
        { icon: FiHome, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: FiBook, label: 'Courses', href: '/admin/courses' },
        { icon: FiUsers, label: 'Students', href: '/admin/students' },
        { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
        { icon: FiSettings, label: 'Settings', href: '/admin/settings' },
    ];

    const menuItems = userType === 'student' ? studentMenuItems : adminMenuItems;

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 256 }}
            className={cn(
                "bg-white h-full border-r border-gray-200 flex flex-col transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <motion.div
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🎮</span>
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Acadeveia
                            </span>
                        )}
                    </motion.div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </button>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                        isActive
                                            ? "bg-purple-50 text-purple-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Info */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">JS</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">John Student</p>
                            <p className="text-xs text-gray-500">Level 12</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.aside>
    );
}