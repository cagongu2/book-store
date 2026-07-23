import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/ui-slice';

const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sidebarCollapsed } = useAppSelector((state) => state.ui);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-white shadow-md transition-all duration-300 ${
                    sidebarCollapsed ? 'w-16' : 'w-64'
                }`}
            >
                <div className="h-16 flex items-center justify-center border-b">
                    <span className="font-bold text-xl truncate">
                        {sidebarCollapsed ? 'CMS' : 'BookStore CMS'}
                    </span>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <span>🏠</span>
                                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center px-4 justify-between">
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        ☰
                    </button>
                    <div>
                        <span className="text-sm font-medium">Admin User</span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
