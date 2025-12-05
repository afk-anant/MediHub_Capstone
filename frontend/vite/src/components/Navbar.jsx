import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <Shield className="w-8 h-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">MediHub</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                        <span onClick={() => navigate('/')} className="cursor-pointer py-1 hover:border-b-2 border-blue-600 uppercase">Home</span>
                        <span onClick={() => navigate('/doctors')} className="cursor-pointer py-1 hover:border-b-2 border-blue-600 uppercase">All Doctors</span>
                        <span onClick={() => navigate('/about')} className="cursor-pointer py-1 hover:border-b-2 border-blue-600 uppercase">About</span>
                        <span onClick={() => navigate('/contact')} className="cursor-pointer py-1 hover:border-b-2 border-blue-600 uppercase">Contact</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                            >
                                Create account
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
