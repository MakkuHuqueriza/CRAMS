'use client';

import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Room, ReservationWithRoom } from '@/utils/database/types';

export default function ViewReservation({ params }: { params: { id: string } }) {
    const { id } = params;
    const [reservation, setReservation] = useState<ReservationWithRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatTime = (timeString: string): string => {
        if (!timeString) return "N/A";
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
    };

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                setLoading(true);
                const supabase = createClient();

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Authentication required");

                const { data, error } = await supabase
                    .from('reservation')
                    .select(`
                        id, user_id, room_id, name, email_address, contact_number, role, course, date_requested, start_time, end_time, status, created_at, nature_of_work, admin_id, reason_for_rejection,
                        room:room_id (room_id, name, room_location, capacity, status, room_type, created_at)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Reservation not found");

                // Transform room data to ensure it matches the expected Room type
                let roomData: Room | null = null;
                
                // Check if room data exists and handle both array and object cases
                if (data.room) {
                    // Handle if room is returned as an array (take first item)
                    const roomInfo = Array.isArray(data.room) ? data.room[0] : data.room;
                    
                    if (roomInfo) {
                        roomData = {
                            room_id: roomInfo.room_id,
                            name: roomInfo.name,
                            room_location:  roomInfo.room_location,
                            capacity: Number(roomInfo.capacity),
                            status: roomInfo.status as 'occupied' | 'vacant',
                            room_type: roomInfo.room_type as 'Lecture' | 'Laboratory',
                            created_at: roomInfo.created_at
                        };
                    }
                }

                // Create the properly typed reservation with room
                const transformedData: ReservationWithRoom = {
                    id: data.id,
                    user_id: data.user_id,
                    name: data.name,
                    email_address: data.email_address,
                    contact_number: data.contact_number,
                    role: data.role,
                    course: data.course,
                    date_requested: data.date_requested,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    nature_of_work: data.nature_of_work,
                    status: data.status,
                    created_at: data.created_at,
                    admin_id: data.admin_id,
                    reason_for_rejection: data.reason_for_rejection,
                    room: roomData
                };

                setReservation(transformedData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load reservation");
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [id]);

    if (loading) return (
        <div className="container mx-auto p-4">
        <p>Loading reservation details...</p>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
        </div>
    );

    if (!reservation) return (
        <div className="container mx-auto p-4">
        <p>Reservation not found</p>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <Link href="/reservations" className="mr-2 p-2 hover:bg-gray-100 rounded-full">
                    <h1 className="text-2xl font-bold">Reservation Details</h1>
                </Link>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{reservation.room?.name || 'Unknown Room'}</h2>
                        <p className="text-gray-600">{reservation.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        reservation.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {reservation.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Time Details</h3>
                        <p className="text-gray-900">
                        {new Date(reservation.date_requested).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                        <p className="text-gray-900">
                        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Room Details</h3>
                        <p className="text-gray-900">Capacity: {reservation.room?.capacity}</p>
                        <p className="text-gray-900">Type: {reservation.room?.room_type}</p>
                        {reservation.course && (
                        <p className="text-gray-900">Course: {reservation.course}</p>
                        )}
                    </div>
                </div>

                    <div className="flex justify-end">
                        <Link
                            href={`/reservations`}
                            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                            Back to My Reservations
                        </Link>
                        <Link
                            href={`/reservations/edit/${id}`}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Edit Reservation
                        </Link>
                    </div>
            </div>
        </div>
    );
}