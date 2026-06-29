import { createClient } from '@supabase/supabase-js';

// حطينا القيم الحقيقية مباشرة عشان نخلص من مشكلة الـ env
const supabaseUrl = 'https://tdszoxicalczhnmuepnc.supabase.co';
const supabaseKey = 'sb_publishable_t8bW2QkXkEgU3XivUn6hZA_6iQomIWr';

export const supabase = createClient(supabaseUrl, supabaseKey);