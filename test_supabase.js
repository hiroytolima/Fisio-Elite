import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fjrgsghsvsmjkczkfowj.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcmdzZ2hzdnNtamtjemtmb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDY3NzYsImV4cCI6MjEwMjkyMjc3Nn0.lzMPASdzMuOQeaxoRsYo3CVEZ1EkNr1M6nDLQ2EIDdY';

const supabase = createClient(supabaseUrl, anonKey);

async function testConnection() {
  console.log('--- TESTE DE CONEXÃO AO SUPABASE ---');
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    console.log('Response Error:', error);
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Falha na comunicação:', err);
  }
}

testConnection();
