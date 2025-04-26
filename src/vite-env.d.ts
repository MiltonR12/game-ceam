/// <reference types="vite/client" />
declare global {
  interface Window {
    TelegramGameProxy?: {
      receiveEvent: (event: string, data: unknown) => void;
    };
  }
}