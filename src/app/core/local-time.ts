const pad = (value: number): string => String(value).padStart(2, '0');

// Hora local sin zona (misma forma que el LocalDateTime de la API).
export function localIsoNow(): string {
  const now = new Date();
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  );
}
