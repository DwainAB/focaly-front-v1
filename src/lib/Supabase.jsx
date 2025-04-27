import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ysypvciwtuyxflkkxnzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeXB2Y2l3dHV5eGZsa2t4bnp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjIwMTg5NiwiZXhwIjoyMDU3Nzc3ODk2fQ.ls8-MZQitr8ZhYbjt-Y8WLgyrraCNR3GJY0MqbgOX14'; // Utilisez votre clé publique (anon key)

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;