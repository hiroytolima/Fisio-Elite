export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public code: string;
  public requestId: string;
  public status: number;

  constructor(status: number, data: ApiErrorResponse) {
    super(data.message || 'Ocorreu um erro na requisição com o servidor.');
    this.name = 'ApiError';
    this.status = status;
    this.code = data.code || 'UNKNOWN_ERROR';
    this.requestId = data.requestId || 'N/A';
  }
}

/**
 * Cliente de API com suporte a Request-ID, Normalização de Erros e Segurança
 */
export async function apiFetch<T>(endpoint: string, options: globalThis.RequestInit = {}): Promise<T> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('X-Request-ID', requestId);

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'same-origin', // Cookies HttpOnly
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse = {
      code: 'HTTP_ERROR',
      message: `Erro HTTP ${response.status}: ${response.statusText}`,
      requestId,
    };
    try {
      const json = await response.json();
      if (json && typeof json === 'object') {
        errorData = { ...errorData, ...json };
      }
    } catch {
      // Falha ao parsear JSON de erro
    }
    throw new ApiError(response.status, errorData);
  }

  return response.json() as Promise<T>;
}
