import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4 cursor-pointer" onClick={() => navigate('/')}>
                            <Shield className="w-8 h-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">MediHub</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Your trusted partner in managing your healthcare needs conveniently and efficiently.
                            Book appointments with top doctors and manage your health records seamlessly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">COMPANY</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>
                                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-blue-600 transition">
                                    Home
                                </span>
                            </li>
                            <li>
                                <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">
                                    About us
                                </span>
                            </li>
                            <li>
                                <span onClick={() => navigate('/contact')} className="cursor-pointer hover:text-blue-600 transition">
                                    Contact us
                                </span>
                            </li>
                            <li>
                                <span onClick={() => navigate('/doctors')} className="cursor-pointer hover:text-blue-600 transition">
                                    All Doctors
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">GET IN TOUCH</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>+1 (415) 555-0132</li>
                            <li>contact@medihub.com</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
                    <p>Copyright © 2024 MediHub - All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
