export function createStatusMessage(userName) {
  const normalizedName = String(userName ?? '').trim();

  return normalizedName ? `IntraMessenger listo para ${normalizedName}` : 'IntraMessenger listo';
}

if (typeof document !== 'undefined') {
  document.documentElement.dataset.intraMessenger = 'ready';
}
