import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("SUPABASE_URL o SUPABASE_KEY no definidos en el archivo .env. La subida de imágenes a Supabase fallará.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
