'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import type { ReservationWithRoom } from '@/utils/database/types';
import Link from 'next/link';

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<ReservationWithRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const formatTime = (timeString: string): string => {
        if (!timeString) return "N/A";
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
    };

    const handleDelete = async (reservationId: string) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            setDeleteId(reservationId);
            const supabase = createClient();
            const { error } = await supabase
                .from('reservation')
                .delete()
                .eq('id', reservationId);
            if (error) throw error;
            setReservations(prev => prev.filter(r => r.id !== reservationId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete reservation.");
        } finally {
            setDeleteId(null);
        }
    };

    const ReservationCard = ({ reservation }: { reservation: ReservationWithRoom }) => {
        if (!reservation.room) return null;

        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start">
                    <h1 className="text-lg font-bold">Reservation Summary</h1>
                    <span className={`px-4 py-2 rounded-full ${
                        reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                        reservation.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {reservation.status}
                    </span>
                </div>

                <div className="mb-6">
                    <p className="font-medium">Reservation ID #{reservation.id}</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column - Personal Information */}
                    <div className="flex-1 mt-5 space-y-3">
                        <h2 className="font-semibold">Personal Information</h2>
                        <div>
                            <p className="text-gray-600">Email:</p>
                            <p className="font-medium">{reservation.email_address}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Contact Number:</p>
                            <p className="font-medium">{reservation.contact_number}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Role:</p>
                            <p className="font-medium">{reservation.role}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Course/Dept/Org:</p>
                            <p className="font-medium">{reservation.course}</p>
                        </div>
                    </div>

                    {/* Right Column - Request for Job Order */}
                    <div className="flex-1 mt-5 space-y-3">
                        <h2 className="font-semibold">Request for Job Order</h2>
                        <div>
                            <p className="text-gray-600">Room:</p>
                            <p className="font-medium">{reservation.room?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Location/Building:</p>
                            <p className="font-medium">{reservation.room?.room_location}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Type:</p>
                            <p className="font-medium">{reservation.room?.room_type}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date:</p>
                            <p className="font-medium">
                                {new Date(reservation.date_requested).toLocaleDateString('en-US', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Time:</p>
                            <p className="font-medium">
                                {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Nature of Work:</p>
                            <p className="font-medium">{reservation.nature_of_work}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-end gap-4 mt-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDelete(reservation.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Cancel Reservation"
                        >
                            Cancel Reservation
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const supabase = createClient();
        
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                if (!user) throw new Error("Please sign in to view reservations.");

                const { data, error } = await supabase
                    .from('reservation')
                    .select(`
                        id, user_id, room_id, name, email_address, contact_number, role, course, date_requested, start_time, end_time, status, nature_of_work, created_at,
                        room (room_id, name, capacity, room_type, room_location)
                    `)
                    .eq("user_id", user.id)
                    .order("date_requested", { ascending: false });

                if (error) throw error;

                const transformedData: ReservationWithRoom[] = (data as any[]).map((item) => ({
                    ...item,
                    room: item.room || null
                }));

                setReservations(transformedData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Failed to fetch reservations.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Header />
                <p>Loading reservations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Header />
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Header />
            <div className="space-y-4">
                {reservations.length === 0 ? (
                    <p>There are currently no reservations.</p>
                ) : (
                    reservations.map((reservation) => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
                    ))
                )}
            </div>
            <Link 
                href={`/`}
                className="fixed bottom-6 left-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Back to Home
            </Link>
        </div>
    );
}

function Header() {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center mb-2">CRAMS</h1>
            <h1 className="text-2xl font-bold">Pending Reservations</h1>
        </div>
    );
}