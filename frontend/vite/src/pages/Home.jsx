import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api';
import { ArrowRight, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroBanner from '../assets/images/hero_banner.png';
import generalPhysicianIcon from '../assets/specialties/general_physician.png';
import gynecologistIcon from '../assets/specialties/gynecologist.png';
import dermatologistIcon from '../assets/specialties/dermatologist.png';
import pediatricianIcon from '../assets/specialties/pediatrician.png';
import neurologistIcon from '../assets/specialties/neurologist.png';
import gastroenterologistIcon from '../assets/specialties/gastroenterologist.png';

export default function Home() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    const specialtyIcons = {
        'General physician': generalPhysicianIcon,
        'Gynecologist': gynecologistIcon,
        'Dermatologist': dermatologistIcon,
        'Pediatrician': pediatricianIcon,
        'Neurologist': neurologistIcon,
        'Gastroenterologist': gastroenterologistIcon
    };

    useEffect(() => {
        fetchTopDoctors();
    }, []);

    const fetchTopDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch(`${API}/api/users/doctors`, { headers });
            if (response.ok) {
                const data = await response.json();
                setDoctors(data.slice(0, 4));
            }
        } catch (err) {
            console.error('Failed to fetch doctors');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <div className="bg-blue-600 text-white rounded-3xl mx-4 md:mx-10 mt-8 p-10 md:p-20 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="z-10 max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Book Appointment <br /> With Trusted Doctors
                    </h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Simply browse through our extensive list of trusted doctors, <br className="hidden md:block" />
                        schedule your appointment hassle-free.
                    </p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        Book appointment <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Hero Image */}
                <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
                    <img src={heroBanner} alt="Doctors" className="absolute right-0 bottom-0 h-full w-auto object-contain" />
                </div>
            </div>

            {/* Speciality Section (Static for now) */}
            <div className="py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Find by Speciality</h2>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
                </p>
                <div className="flex flex-wrap justify-center gap-8 px-4">
                    {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'].map((spec) => (
                        <div
                            key={spec}
                            onClick={() => navigate(`/doctors?specialization=${spec}`)}
                            className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition overflow-hidden">
                                {specialtyIcons[spec] ? (
                                    <img src={specialtyIcons[spec]} alt={spec} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                        <User className="w-8 h-8 text-blue-600" />
                                    </div>
                                )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{spec}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Doctors Section */}
            <div className="py-10 px-4 md:px-10 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Top Doctors to Book</h2>
                <p className="text-center text-gray-600 mb-12">Simply browse through our extensive list of trusted doctors.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {doctors.map((doc) => (
                        <div
                            key={doc._id}
                            onClick={() => navigate(`/doctors/${doc._id}`)}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-2 transition duration-300 cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="bg-blue-50 h-48 flex items-center justify-center">
                                {doc.image ? (
                                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-20 h-20 text-blue-300" />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-green-500 text-sm font-medium mb-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Available
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Dr. {doc.name}</h3>
                                <p className="text-gray-600 text-sm">{doc.specialization || 'General Physician'}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/doctors')}
                        className="bg-blue-50 text-gray-700 px-10 py-3 rounded-full font-medium hover:bg-blue-100 transition"
                    >
                        more
                    </button>
                </div>
            </div>

            {/* Banner Section */}
            <div className="bg-blue-600 text-white rounded-3xl mx-4 md:mx-10 my-20 p-10 md:p-20 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Book Appointment <br /> With 100+ Trusted Doctors</h2>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                    >
                        Create account
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
