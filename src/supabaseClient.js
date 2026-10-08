// import { createClient } from '@supabase/supabase-js';

// // حطينا القيم الحقيقية مباشرة عشان نخلص من مشكلة الـ env
// const supabaseUrl = 'https://tdszoxicalczhnmuepnc.supabase.co';
// const supabaseKey = 'sb_publishable_t8bW2QkXkEgU3XivUn6hZA_6iQomIWr';

// export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('مفاتيح Supabase ناقصة. تأكدي من وجود ملف .env وفيه VITE_SUPABASE_URL و VITE_SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);