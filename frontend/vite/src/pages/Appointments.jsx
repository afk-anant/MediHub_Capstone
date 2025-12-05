import { useState, useEffect } from 'react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Plus } from 'lucide-react';

export default function Appointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: ''
    });

    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchAppointments();
        if (user.role === 'PATIENT') {
            fetchDoctors();
        }
    }, [user.role]);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/api/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (err) {
            console.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async (specialization = '') => {
        try {
            const token = localStorage.getItem('token');
            let url = `${API}/api/users/doctors`;
            if (specialization) {
                url += `?specialization=${specialization}`;
            }
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            }
        } catch (err) {
            console.error('Failed to fetch doctors');
        }
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilter(value);
        fetchDoctors(value);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setBooking(true);

        try {
            const token = localStorage.getItem('token');
            // Combine date and time
            const appointmentDate = new Date(`${formData.date}T${formData.time}`);

            const response = await fetch(`${API}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: formData.doctorId,
                    date: appointmentDate
                })
            });

            if (response.ok) {
                const newAppointment = await response.json();
                // Refresh list
                fetchAppointments();
                setFormData({ doctorId: '', date: '', time: '' });
                alert('Appointment booked successfully!');
            } else {
                alert('Failed to book appointment');
            }
        } catch (err) {
            alert('Error booking appointment');
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-8 h-8 text-purple-600" />
                        Appointments
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your schedule and consultations</p>
                </div>

                {user.role === 'PATIENT' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Book New Appointment</h2>

                        {/* Filter Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Doctors by Specialization</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['General Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'].map((spec) => (
                                    <button
                                        key={spec}
                                        onClick={() => {
                                            const newValue = filter === spec ? '' : spec;
                                            setFilter(newValue);
                                            fetchDoctors(newValue);
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === spec
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {spec}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleBook} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                                    <select
                                        value={formData.doctorId}
                                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        required
                                    >
                                        <option value="">Choose a doctor...</option>
                                        {doctors.length > 0 ? (
                                            doctors.map(doc => (
                                                <option key={doc._id} value={doc._id}>
                                                    Dr. {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No doctors available</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Visual Time Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                                <div className="flex flex-wrap gap-3">
                                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'].map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, time })}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${formData.time === time
                                                    ? 'bg-purple-600 text-white border-purple-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                {!formData.time && <p className="text-xs text-red-500 mt-1">Please select a time slot</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={booking || !formData.time || !formData.date || !formData.doctorId}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {booking ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No appointments scheduled.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {appointments.map((apt) => (
                                <div key={apt._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                                            {new Date(apt.date).getDate()}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {user.role === 'PATIENT' ? `Dr. ${apt.doctorId?.name}` : `Patient: ${apt.patientId?.name}`}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${apt.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
