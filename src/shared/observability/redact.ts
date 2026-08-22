/**
 * Lista de chaves/propriedades que contêm dados pessoais (PII),
 * credenciais ou informações médicas sensíveis que NUNCA devem ser expostas em logs.
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cpf',
  'rg',
  'patient_name',
  'patientName',
  'name',
  'email',
  'phone',
  'medicalRecord',
  'medical_record',
  'diagnosis',
  'ssn',
]);

/**
 * Função utilitária de redaction que remove/mascara propriedades sensíveis em objetos de log.
 * @param data Objeto ou valor a ser sanitizado
 * @returns Objeto sanitizado seguro para logging
 */
export function redactSensitiveData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Reduz strings longas que possam conter tokens JWT
    if (data.startsWith('Bearer ') || data.length > 256) {
      return '[REDACTED_TOKEN_OR_BLOB]' as unknown as T;
    }
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item)) as unknown as T;
  }

  const redactedObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      redactedObj[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redactedObj[key] = redactSensitiveData(value);
    } else {
      redactedObj[key] = value;
    }
  }

  return redactedObj as T;
}
