import React from 'react';
import { Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white px-4 md:px-10 py-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-medium text-gray-500 text-center mb-10">
                        CONTACT <span className="text-gray-900 font-bold">US</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-12 justify-center mb-20">
                        <div className="md:w-1/3 max-w-sm">
                            {/* Contact Image */}
                            <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-32 h-32 text-blue-600" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-6 text-gray-600">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-4">OUR OFFICE</h3>
                                <p className="mb-1">54709 Willms Station</p>
                                <p>Suite 350, Washington, USA</p>
                            </div>

                            <div>
                                <p className="mb-1">Tel: (415) 555-0132</p>
                                <p>Email: greatstackdev@gmail.com</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-4">CAREERS AT MEDIHUB</h3>
                                <p className="mb-6">Learn more about our teams and job openings.</p>
                                <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition duration-500">
                                    Explore Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
