import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRÍTICO: SUPABASE_URL o SUPABASE_KEY no definidos. Las imágenes no funcionarán.");
    // Cliente mock para que no pete el servidor al importar
    supabase = {
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: new Error("Supabase no configurado") }),
                getPublicUrl: () => ({ data: { publicUrl: null } })
            })
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
