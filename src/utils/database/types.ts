export interface Database {
    public: {
      Tables: {
        reservation: {
            Row: {
                id: string;
                user_id: string;
                room_id: string;
                name: string;
                email_address: string;
                contact_number: string;
                role: string;
                course: string;
                date_requested: string;
                start_time: string;
                end_time: string;
                status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
                created_at: string;
                nature_of_work: string;
                admin_id: string | null;
                reason_for_rejection: string | null;
            };
            Insert: {
                user_id: string;
                room_id: string;
                name: string;
                email_address: string;
                contact_number: string;
                role: string;
                course: string;
                date_requested: string;
                start_time: string;
                end_time: string;
                status?: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
                nature_of_work?: string;
            };
            Update: {
                status?: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
                admin_id?: string | null;
                reason_for_rejection?: string | null;
            };
        };
        room: {
            Row: {
                room_id: string;
                name: string;
                room_location: string;
                capacity: number;
                status: 'occupied' | 'vacant';
                room_type: 'Lecture' | 'Laboratory';
                created_at: string;
            };
            Insert: {
                name: string;
                room_location: string;
                capacity: number;
                status: 'occupied' | 'vacant';
                room_type: 'Lecture' | 'Laboratory';
            };
            Update: {
                name?: string;
                room_location?: string;
                room_type?: 'Lecture' | 'Laboratory';
                status?: 'occupied' | 'vacant';
            };
        };
        schedule: {
          Row: {
            id: string;
            room_id: string | null;
            created_at: string;
            class: string | null;
            start_time: string;
            end_time: string;
            day: string | null
          };
          Insert: {
            id?: string;
            room_id?: string | null;
            created_at?: string;
            class?: string | null;
            start_time: string;
            end_time: string;
            day: string | null
          };
          Update: {
            room_id?: string | null;
            class?: string | null;
            start_time?: string;
            end_time?: string;
            day?: string | null
          };
        }
      };
    };
  }
  
  // Core Types
  export type Reservation = Database['public']['Tables']['reservation']['Row'];
  export type Room = Database['public']['Tables']['room']['Row'];
  export type ReservationInsert = Database['public']['Tables']['reservation']['Insert'];
  export type ReservationUpdate = Database['public']['Tables']['reservation']['Update'];
  export type RoomInsert = Database['public']['Tables']['room']['Insert'];
  export type RoomUpdate = Database['public']['Tables']['room']['Update'];

  export type Schedule = Database['public']['Tables']['schedule']['Row'];
  export type ScheduleInsert = Database['public']['Tables']['schedule']['Insert'];
  export type ScheduleUpdate = Database['public']['Tables']['schedule']['Update'];
  
  // Extended Types
  export type ReservationWithRoom = Omit<Reservation, 'room_id'> & {
    room: Room | null;
  };
  
  export type ReservationWithRelations = Reservation & {
    rooms: Room;
    users?: {
      email: string;
    };
  };
  
  // Form Types
  export interface ReservationFormValues {
    name: string;
    email: string;
    contact_number: string;
    role: string;
    course: string;
    date: string | Date;
    start_time: string;
    end_time: string;
    room_id: string;
    room_location: string;
    room_type: string;
    nature_of_work: string;
  }
  
  // Status Types
  export type ReservationStatus = Database['public']['Tables']['reservation']['Row']['status'];
  export type RoomStatus = Database['public']['Tables']['room']['Row']['status'];
  export type RoomType = Database['public']['Tables']['room']['Row']['room_type'];
  
  // Component Props
  export interface ReservationCardProps {
    reservation: ReservationWithRoom;
    onCancel?: (id: string) => Promise<void>;
    className?: string;
  }
  
  export interface ReservationFormProps {
    initialValues?: Partial<ReservationFormValues>;
    onSubmit: (values: ReservationFormValues) => Promise<void>;
    rooms: Room[];
    isSubmitting?: boolean;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
  }
  
  // Filter Types
  export interface ReservationsFilter {
    status?: ReservationStatus;
    date_from?: string;
    date_to?: string;
    room_type?: RoomType;
    user_id?: string;
  }

  export type ScheduleWithRoom = Schedule & {
    room: Room | null;
  };

  export type RoomWithSchedules = Room & {
    schedule: Schedule[];
  };

  export interface ScheduleFormValues {
    start_time: string;
    end_time: string;
    room_id: string | null;
    day: string | null;
    class: string | null;
  }