import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DoctorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [booking, setBooking] = useState(false);
    const [relatedDoctors, setRelatedDoctors] = useState([]);

    // Generate next 7 days for date selection
    const getNext7Days = () => {
        const days = [];
        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                day: daysOfWeek[date.getDay()],
                date: date.getDate(),
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return days;
    };

    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    useEffect(() => {
        fetchDoctorDetails();
    }, [id]);

    useEffect(() => {
        if (doctor?.specialization) {
            fetchRelatedDoctors();
        }
    }, [doctor]);

    const fetchDoctorDetails = async () => {
        try {
            const response = await fetch(`${API}/api/users/doctors/${id}`);
            if (response.ok) {
                const data = await response.json();
                setDoctor(data);
            } else {
                console.error('Failed to fetch doctor details');
            }
        } catch (err) {
            console.error('Error fetching doctor:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch(`${API}/api/users/doctors?specialization=${doctor.specialization}`, { headers });
            if (response.ok) {
                const data = await response.json();
                // Filter out current doctor and limit to 4
                setRelatedDoctors(data.filter(d => d._id !== id).slice(0, 4));
            }
        } catch (err) {
            console.error('Error fetching related doctors:', err);
        }
    };

    const handleBookAppointment = async () => {
        // Check if user is logged in
        if (!user) {
            navigate('/login', { state: { from: `/doctors/${id}` } });
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        setBooking(true);
        try {
            const token = localStorage.getItem('token');
            const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);

            const response = await fetch(`${API}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: id,
                    date: appointmentDateTime
                })
            });

            if (response.ok) {
                alert('Appointment booked successfully!');
                navigate('/appointments');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to book appointment');
            }
        } catch (err) {
            alert('Error booking appointment');
            console.error(err);
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-gray-500">Loading doctor details...</div>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-gray-500">Doctor not found</div>
                </div>
            </div>
        );
    }

    const days = getNext7Days();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Doctor Info Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Doctor Image */}
                        <div className="flex-shrink-0">
                            <div className="w-48 h-48 bg-blue-600 rounded-xl overflow-hidden">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-24 h-24 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>

                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <span>{doctor.degree || 'MBBS'}</span>
                                <span>•</span>
                                <span>{doctor.specialization || 'General Physician'}</span>
                                <span className="px-2 py-1 bg-gray-100 rounded text-sm">{doctor.experience || '5 Years'}</span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-5 h-5 text-gray-600" />
                                    <span className="font-semibold text-gray-900">About</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {doctor.about || `Dr. ${doctor.name} is a dedicated ${doctor.specialization || 'physician'} with extensive experience in patient care. Committed to providing the highest quality medical services with compassion and expertise.`}
                                </p>
                            </div>

                            <div className="text-gray-900">
                                <span className="font-semibold">Appointment fee:</span> ₹{doctor.fee || 500}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking slots</h2>

                    {/* Date Selection */}
                    <div className="mb-6">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {days.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(day.fullDate)}
                                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 border-2 rounded-lg transition ${selectedDate === day.fullDate
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-xs text-gray-500 mb-1">{day.day}</span>
                                    <span className="text-lg font-semibold text-gray-900">{day.date}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="mb-6">
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-4 py-2 border rounded-full text-sm font-medium transition ${selectedTime === time
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Book Button */}
                    <button
                        onClick={handleBookAppointment}
                        disabled={booking || !selectedDate || !selectedTime}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {booking ? 'Booking...' : 'Book an appointment'}
                    </button>
                </div>

                {/* Related Doctors */}
                {relatedDoctors.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Doctors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedDoctors.map((doc) => (
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
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
