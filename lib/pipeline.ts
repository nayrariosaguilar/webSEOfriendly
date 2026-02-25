const EDGE_FUNCTIONS_URL = 'https://gzragjctmjwglgurscrf.functions.supabase.co';

export interface SeoStructure {
  tema: string;
  keyword_principal: string;
  variantes_keyword: string[];
  titulo_seo: string;
  h2_sugeridos: string[];
  resumen_base: string;
}

export interface GenerateSeoResult {
  success: boolean;
  seoStructure?: SeoStructure;
  error?: string;
}

export async function generateSeoStructure(drawing_id: string): Promise<GenerateSeoResult> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  const response = await fetch(`${EDGE_FUNCTIONS_URL}/generate-seo-structure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ drawing_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data.error ?? `HTTP ${response.status}` };
  }

  return data as GenerateSeoResult;
}
