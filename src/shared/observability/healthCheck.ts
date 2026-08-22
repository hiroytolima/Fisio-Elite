import { supabase } from '@/shared/api/supabase.client';

export interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  services: {
    supabaseAuth: boolean;
    supabaseDatabase: boolean;
  };
}

/**
 * Executa uma verificação de integridade dos serviços do Supabase.
 */
export async function checkSystemHealth(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  let supabaseAuth = false;
  let supabaseDatabase = false;

  try {
    const { data } = await supabase.auth.getSession();
    supabaseAuth = !!data;
  } catch {
    supabaseAuth = false;
  }

  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    supabaseDatabase = !error;
  } catch {
    supabaseDatabase = false;
  }

  const isHealthy = supabaseAuth || supabaseDatabase;

  return {
    status: isHealthy ? 'ok' : 'error',
    timestamp,
    services: {
      supabaseAuth,
      supabaseDatabase,
    },
  };
}
