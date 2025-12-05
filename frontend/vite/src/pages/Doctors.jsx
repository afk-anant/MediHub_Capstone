import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API } from '../api';
import { User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Doctors() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [filterDoc, setFilterDoc] = useState([]);
    const [speciality, setSpeciality] = useState(searchParams.get('specialization') || '');

    const specialities = [
        'General Physician',
        'Gynecologist',
        'Dermatologist',
        'Pediatrician',
        'Neurologist',
        'Gastroenterologist'
    ];

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.specialization === speciality));
        } else {
            setFilterDoc(doctors);
        }
    }, [doctors, speciality]);

    useEffect(() => {
        const spec = searchParams.get('specialization');
        if (spec) {
            setSpeciality(spec);
        }
    }, [searchParams]);


    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch(`${API}/api/users/doctors`, { headers });
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
                setFilterDoc(data);
            }
        } catch (err) {
            console.error('Failed to fetch doctors');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="px-4 md:px-10 py-10">
                <p className="text-gray-600 mb-6">Browse through the doctors specialist.</p>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className="flex flex-col gap-4 text-sm text-gray-600 min-w-[200px]">
                        {specialities.map((spec) => (
                            <p
                                key={spec}
                                onClick={() => {
                                    if (speciality === spec) {
                                        setSpeciality('');
                                        navigate('/doctors');
                                    } else {
                                        setSpeciality(spec);
                                        navigate(`/doctors?specialization=${spec}`);
                                    }
                                }}
                                className={`w-full pl-3 py-1.5 pr-16 border border-gray-300 rounded transition duration-300 cursor-pointer ${speciality === spec ? 'bg-blue-100 text-black' : 'hover:bg-gray-50'}`}
                            >
                                {spec}
                            </p>
                        ))}
                    </div>

                    {/* Doctors Grid */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
                        {filterDoc.map((doc) => (
                            <div
                                key={doc._id}
                                onClick={() => navigate(`/doctors/${doc._id}`)}
                                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition duration-500"
                            >
                                <div className="bg-blue-50 h-48 flex items-center justify-center">
                                    {doc.image ? (
                                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-20 h-20 text-blue-300" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-green-500 font-medium mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <p>Available</p>
                                    </div>
                                    <h3 className="text-gray-900 text-lg font-medium">Dr. {doc.name}</h3>
                                    <p className="text-gray-600 text-sm">{doc.specialization || 'General Physician'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
