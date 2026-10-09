
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('مفاتيح Supabase ناقصة. تأكدي من وجود ملف .env وفيه VITE_SUPABASE_URL و VITE_SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);