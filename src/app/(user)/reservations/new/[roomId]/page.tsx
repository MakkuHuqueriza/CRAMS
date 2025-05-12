import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NewReservationForm from './NewReservationForm'
import { Database } from '@/utils/database/types'
import { Suspense } from 'react'

// Define a separate async function for data fetching
async function fetchRoomData(roomId: string) {
  // Create the Supabase client
  const supabase = createServerComponentClient<Database>({ cookies })
  
  // Fetch the specific room data
  const { data: room, error: roomError } = await supabase
    .from('room')
    .select('room_id, name, room_location, room_type')
    .eq('room_id', roomId)
    .single()

  // Also fetch all rooms for the dropdown
  const { data: allRooms, error: allRoomsError } = await supabase
    .from('room')
    .select('room_id, name, room_location, room_type')
    .order('name', { ascending: true })

  if (roomError || allRoomsError) {
    console.error('Error fetching rooms:', roomError || allRoomsError)
    throw roomError || allRoomsError
  }

  return { room, allRooms }
}

// Content component that receives the already-resolved roomId
function ReservationContent({ 
  room, 
  allRooms 
}: { 
  room: any; 
  allRooms: any[] 
}) {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">New Reservation</h1>
      <NewReservationForm 
        rooms={allRooms || []} 
        initialRoom={room || null}
      />
    </div>
  )
}

// Error boundary component
function ErrorDisplay() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">New Reservation</h1>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load room data. Please try again later.
      </div>
    </div>
  )
}

// Main page component
export default async function NewReservationPage({ params }: { params: { roomId: string } }) {
  try {
    // Extract roomId from params in a way that works with Next.js
    const { roomId } = params
    
    // Fetch data with the extracted roomId
    const { room, allRooms } = await fetchRoomData(roomId)
    
    // Render the page content with fetched data
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ReservationContent room={room} allRooms={allRooms || []} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in NewReservationPage:', error)
    return <ErrorDisplay />
  }
}