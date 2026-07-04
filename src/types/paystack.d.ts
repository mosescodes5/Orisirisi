export {};

declare global {
  interface PaystackPopSetupOptions {
    key: string;
    email: string;
    amount: number; // kobo
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }

  interface PaystackPopHandler {
    openIframe: () => void;
  }

  interface PaystackPop {
    setup: (options: PaystackPopSetupOptions) => PaystackPopHandler;
  }

  interface Window {
    PaystackPop?: PaystackPop;
  }
}
