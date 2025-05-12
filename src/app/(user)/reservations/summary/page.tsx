"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ReservationSummary() {
    const supabase = createClient();
    const router = useRouter();
    const [reservationData, setReservationData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const data = localStorage.getItem('reservationData');
        if (data) {
            const parsedData = JSON.parse(data);
            if (!parsedData.room || !parsedData.room.room_id) {
                router.push("/reservations/new");
                return;
            }
            setReservationData(parsedData);
        } else {
            // Redirect to new reservations page if no data
            router.push("/reservations/new");
        }
    }, [router]);

    const handleSubmit = async () => {
        if (!reservationData) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
                throw new Error(authError?.message || "User not authenticated");
            }

            const { error: insertError } = await supabase
                .from('reservation')
                .insert({
                    user_id: user.id,
                    name: reservationData.name,
                    email_address: reservationData.email_address,
                    contact_number: reservationData.contact_number,
                    role: reservationData.role,
                    course: reservationData.course,
                    date_requested: new Date(reservationData.date).toISOString(),
                    start_time: reservationData.start_time,
                    end_time: reservationData.end_time,
                    nature_of_work: reservationData.nature_of_work,
                    room_id: reservationData.room?.room_id || reservationData.room_id,
                    status: 'Pending',
                    admin_id: null
                })
                .select();

            if (insertError) throw insertError;
            
            // Clear the form data from localStorage after successful submission
            localStorage.removeItem('reservationData');
            router.push('/reservations/success');
        } catch (err) {
            console.error("Submission error:", err);
            setError(err instanceof Error ? err.message : "Failed to submit reservation");
        } finally {
            setIsLoading(false);
        }
    };

    if (!reservationData) return <div className="p-8 text-center">Loading reservation details...</div>;

    return (
        <div className="max-w-4xl auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-8">Reservation Summary</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
                    <div>
                        <p className="text-gray-600">Name: </p>
                        <p className="font-medium">{reservationData.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email: </p>
                        <p className="font-medium">{reservationData.email_address}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Contact Number: </p>
                        <p className="font-medium">{reservationData.contact_number}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Role: </p>
                        <p className="font-medium">{reservationData.role}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Course/Dept/Org: </p>
                        <p className="font-medium">{reservationData.course}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Request for Job Order</h2>
                    <div>
                        <p className="text-gray-600">Room: </p>
                        <p className="font-medium">{reservationData?.room?.room_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Location/Building: </p>
                        <p className="font-medium">{reservationData?.room?.room_location}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Type: </p>
                        <p className="font-medium">{reservationData?.room?.room_type}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Date: </p>
                        <p className="font-medium">{new Date(reservationData.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Time: </p>
                        <p className="font-medium">{reservationData.start_time} - {reservationData.end_time}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Nature of Work: </p>
                        <p className="font-medium">{reservationData.nature_of_work}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between border-t pt-6">
                <button
                    onClick={() => router.push('/reservations/new/${encodeURIComponent(reservationData.room.name)}')}
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Back to Edit
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`px-6 py-3 text-white rounded-md transition-colors ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isLoading ? "Submitting..." : "Confirm Reservation"}
                </button>
            </div>
        </div>
    );
}