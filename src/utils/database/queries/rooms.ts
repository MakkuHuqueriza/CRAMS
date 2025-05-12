import { supabase } from '@/utils/supabase/client';

export const checkRoomAvailability = async (
    roomId: string,
    date: string,
    start_time: string,
    end_time: string
) => {
    const { data, error } = await supabase.rpc('check_room_avaiability' , {
        roomId: roomId,
        check_date: date,
        start_time: start_time,
        end_time: end_time
    });

    if (error) throw new Error(error.message);
    return data;
};