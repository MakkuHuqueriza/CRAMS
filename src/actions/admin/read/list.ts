import { supabase } from 'src/utils/supabase';

export const getReservations = async() => {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};