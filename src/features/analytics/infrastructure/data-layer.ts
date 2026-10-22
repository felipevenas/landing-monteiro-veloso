type DataLayer = Array<Record<string, unknown> | unknown[]>;

declare global {
  interface Window {
    dataLayer?: DataLayer;
  }
}

export function getDataLayer(): DataLayer {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

export function pushToDataLayer(payload: Record<string, unknown>): void {
  getDataLayer().push(payload);
}

export function pushCommand(command: string, ...args: unknown[]): void {
  getDataLayer().push([command, ...args]);
}
