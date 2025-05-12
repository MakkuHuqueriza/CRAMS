'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/utils/database/types'
import { useState, useEffect } from 'react'

interface Room {
  room_id: string
  name: string
  room_location: string
  room_type: string
}

interface NewReservationFormProps {
  rooms: Room[]
  initialRoom: Room | null
}

const NewReservationForm = ({ rooms, initialRoom }: NewReservationFormProps) => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    contact_number: '',
    role: '',
    course: '',
    date: new Date(),
    start_time: '09:00',
    end_time: '10:00',
    room_id: '',
    room_location: '',
    room_type: '',
    nature_of_work: ''
  })

  // Set initial room data
  useEffect(() => {
    if (initialRoom) {
      setFormData(prev => ({
        ...prev,
        room_id: initialRoom.room_id,
        room_location: initialRoom.room_location,
        room_type: initialRoom.room_type
      }))
    }
  }, [initialRoom])

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = rooms.find(room => room.room_id === roomId)
    if (!selectedRoom) return

    setFormData(prev => ({
      ...prev,
      room_id: selectedRoom.room_id,
      room_location: selectedRoom.room_location,
      room_type: selectedRoom.room_type
    }))
  }

  const handleDateChange = (date: Date) => {
    setFormData({...formData, date})
  }

  const handleTimeChange = (field: 'start_time' | 'end_time', time: string) => {
    if (field === 'start_time' && formData.end_time && time > formData.end_time) {
      setFormErrors({...formErrors, end_time: "End time must be after start time"})
    }
    else if (field === 'end_time' && formData.start_time && time < formData.start_time) {
      setFormErrors({...formErrors, start_time: "Start time must be before end time"})
    }
    else {
      setFormErrors({...formErrors, start_time: '', end_time: ''})
    }
    
    setFormData({...formData, [field]: time})
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.contact_number.trim()) errors.contact_number = "Contact number is required"
    if (!formData.email_address.trim()) errors.email_address = "Email is required"
    if (!formData.role.trim()) errors.role = "Role is required"
    if (!formData.course.trim()) errors.course = "Course/Department/Organization is required"
    if (!formData.room_id) errors.room_id = "Room is required"
    if (!formData.date) errors.date = "Date is required"
    if (!formData.start_time) errors.start_time = "Start time is required"
    if (!formData.end_time) errors.end_time = "End time is required"
    if (!formData.nature_of_work.trim()) errors.nature_of_work = "Nature of work is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return

    setLoading(true)
    setErrorMessage(null)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error(authError?.message || "User not authenticated!")

      // Check for conflicts
      const { data: existingReservations, error: conflictError } = await supabase
        .from('reservations')
        .select('start_time, end_time')
        .eq('room_id', formData.room_id)
        .eq('date_requested', formData.date.toISOString().split('T')[0])

      if (conflictError) throw new Error("Error checking for conflicting reservations.");

      const conflictTime = existingReservations?.some(res => {
        return (
          formData.start_time < res.end_time &&
          formData.end_time > res.start_time
        )
      })

      if (conflictTime) {
        setErrorMessage("This room is already reserved during the selected time.")
        setLoading(false)
        return
      }

      const { error } = await supabase.from('reservations').insert({
        user_id: user.id,
        name: formData.name,
        email_address: formData.email_address,
        contact_number: formData.contact_number,
        role: formData.role,
        course: formData.course,
        date_requested: formData.date.toISOString(),
        start_time: formData.start_time,
        end_time: formData.end_time,
        room_id: formData.room_id,
        room_location: formData.room_location,
        room_type: formData.room_type,
        nature_of_work: formData.nature_of_work,
        status: 'pending' // Adding default status
      })

      if (error) throw error
      
      router.push('/reservations')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create reservation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input 
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input 
          type="email"
          value={formData.email_address}
          onChange={(e) => setFormData({...formData, email_address: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.email_address && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email_address}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Contact Number</label>
        <input 
          type="tel"
          value={formData.contact_number}
          onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.contact_number && (
          <p className="mt-1 text-sm text-red-600">{formErrors.contact_number}</p>
        )}
      </div>
      
      <div>
        <label className="block mb-1 font-medium">Role</label>
        <input 
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.role && (
          <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Course/Department/Organization</label>
        <input 
          type="text"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.course && (
          <p className="mt-1 text-sm text-red-600">{formErrors.course}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Room</label>
        <select
          value={formData.room_id}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={rooms.length === 0}
        >
          <option value="">Select a Room</option>
          {rooms.map(room => (
            <option key={room.room_id} value={room.room_id}>
              {room.name} ({room.room_location})
            </option>
          ))}
        </select>
        {formErrors.room_id && (
          <p className="mt-1 text-sm text-red-600">{formErrors.room_id}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Location/Building</label>
        <input
          type="text"
          value={formData.room_location}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Room Type</label>
        <input
          type="text"
          value={formData.room_type}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Date of Reservation</label>
        <input
          type="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded"
          required
        />
        {formErrors.date && (
          <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => handleTimeChange('start_time', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {formErrors.start_time && (
            <p className="mt-1 text-sm text-red-600">{formErrors.start_time}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => handleTimeChange('end_time', e.target.value)}
            min={formData.start_time}
            className="w-full p-2 border rounded"
            required
          />
          {formErrors.end_time && (
            <p className="mt-1 text-sm text-red-600">{formErrors.end_time}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block mb-1 font-medium">Nature of Work</label>
        <textarea 
          value={formData.nature_of_work}
          onChange={(e) => setFormData({...formData, nature_of_work: e.target.value})}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
        {formErrors.nature_of_work && (
          <p className="mt-1 text-sm text-red-600">{formErrors.nature_of_work}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={() => router.push('/reservations')}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Reservation'}
        </button>
      </div>
    </form>
  )
}

export default NewReservationForm;