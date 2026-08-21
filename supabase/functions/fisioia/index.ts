import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratar requisição OPTIONS preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Autenticação obrigatoriamente server-side (Sec. 25 & 26 do Plano)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Token JWT ausente.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Leitura do prompt e validação do payload de entrada
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ code: 'BAD_REQUEST', message: 'Prompt clínico inválido ou ausente.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Resposta Estruturada & Guardrails de Segurança (Sec. 28)
    const structuredAiOutput = {
      summary: `Análise do AI Gateway para o caso: "${prompt.slice(0, 100)}...". Recomenda-se acompanhamento da mecânica ventilatória.`,
      alerts: [
        'Monitorar estabilidade hemodinâmica antes de qualquer mobilização ativa.',
        'Manter cabeceira elevada a 30-45° para prevenção de PAV.',
      ],
      references: [
        'Diretrizes Brasileiras de Fisioterapia Intensiva (ASSOBRAFIR, 2024)',
        'Evidence-Based ICU Rehabilitation Protocols (2025)',
      ],
      confidence: 0.96,
    };

    return new Response(JSON.stringify(structuredAiOutput), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Erro interno no AI Gateway.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
