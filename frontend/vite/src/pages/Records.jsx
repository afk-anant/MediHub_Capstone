import { useState, useEffect } from 'react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Download, Trash2, AlertCircle } from 'lucide-react';

export default function Records() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');

    const [doctors, setDoctors] = useState([]);
    const [sharing, setSharing] = useState(null); // Record ID being shared
    const [selectedDoctor, setSelectedDoctor] = useState('');

    useEffect(() => {
        fetchRecords();
        fetchDoctors();
    }, []);

    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/api/patients/${user.id}/records`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch records');

            const data = await response.json();
            setRecords(data);
        } catch (err) {
            setError('Could not load records');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/api/users/doctors`, {
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

    const handleShare = async (recordId) => {
        if (!selectedDoctor) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/api/patients/${recordId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ doctorId: selectedDoctor })
            });

            if (response.ok) {
                alert('Record shared successfully');
                setSharing(null);
                setSelectedDoctor('');
                fetchRecords(); // Refresh to show updated status if needed
            } else {
                alert('Failed to share record');
            }
        } catch (err) {
            alert('Error sharing record');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/api/patients/${user.id}/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const newRecord = await response.json();
            setRecords([newRecord, ...records]);
            setSelectedFile(null);
            setDescription('');
            // Reset file input
            document.getElementById('file-upload').value = '';
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            Medical Records
                        </h1>
                        <p className="text-gray-600 mt-1">Manage your health documents and reports</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Record</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Blood Test Results"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload Record
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Records List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Your Records</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading records...</div>
                    ) : records.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No records found. Upload your first document above.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {records.map((record) => (
                                <div key={record._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{record.filename}</h3>
                                            <p className="text-sm text-gray-500">
                                                {record.description || 'No description'} • {new Date(record.uploadedAt).toLocaleDateString()}
                                            </p>
                                            {record.sharedWith && record.sharedWith.length > 0 && (
                                                <p className="text-xs text-blue-600 mt-1">Shared with {record.sharedWith.length} doctor(s)</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {sharing === record._id ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={selectedDoctor}
                                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="">Select Doctor</option>
                                                    {doctors.map(doc => (
                                                        <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleShare(record._id)}
                                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setSharing(null)}
                                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSharing(record._id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Share
                                            </button>
                                        )}
                                        <button
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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
