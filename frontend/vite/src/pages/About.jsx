import React from 'react';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white px-4 md:px-10 py-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-medium text-gray-500 text-center mb-10">
                        ABOUT <span className="text-gray-900 font-bold">US</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-12 mb-20">
                        <div className="md:w-1/3">
                            {/* About Image */}
                            <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-32 h-32 text-blue-600" />
                            </div>
                        </div>
                        <div className="md:w-2/3 flex flex-col justify-center gap-6 text-gray-600 text-sm leading-relaxed">
                            <p>
                                Welcome to MediHub, your trusted partner in managing your healthcare needs conveniently and efficiently. At MediHub, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
                            </p>
                            <p>
                                MediHub is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, MediHub is here to support you every step of the way.
                            </p>
                            <div className="mt-4">
                                <h3 className="text-gray-900 font-bold mb-2">Our Vision</h3>
                                <p>
                                    Our vision at MediHub is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-medium text-gray-500 mb-8">
                        WHY <span className="text-gray-900 font-bold">CHOOSE US</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 mb-20 border border-gray-200">
                        <div className="p-10 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-blue-600 hover:text-white transition duration-300 group cursor-pointer">
                            <h3 className="font-bold mb-4 text-gray-900 group-hover:text-white">EFFICIENCY:</h3>
                            <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                        </div>
                        <div className="p-10 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-blue-600 hover:text-white transition duration-300 group cursor-pointer">
                            <h3 className="font-bold mb-4 text-gray-900 group-hover:text-white">CONVENIENCE:</h3>
                            <p>Access to a network of trusted healthcare professionals in your area.</p>
                        </div>
                        <div className="p-10 hover:bg-blue-600 hover:text-white transition duration-300 group cursor-pointer">
                            <h3 className="font-bold mb-4 text-gray-900 group-hover:text-white">PERSONALIZATION:</h3>
                            <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
