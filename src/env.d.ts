/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, data?: any) => Promise<any>;
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (data: any) => void) => void;
    };
  }
}
