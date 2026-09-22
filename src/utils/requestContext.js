import { GEMINI_TIMEOUT_MS } from '../config/gemini.js';
import { AppError } from './AppError.js';

export const createRequestContext = ({ signal, timeoutMs } = {}) => {
  const resolvedTimeout = timeoutMs === undefined ? GEMINI_TIMEOUT_MS : Number(timeoutMs);
  if (!Number.isFinite(resolvedTimeout) || resolvedTimeout <= 0) {
    throw new AppError('timeoutMs must be a finite positive number', 400, 'VALIDATION_ERROR');
  }

  const timeoutController = new globalThis.AbortController();
  const timeoutId = globalThis.setTimeout(() => timeoutController.abort(), resolvedTimeout);
  timeoutId.unref?.();

  let operationSignal;
  let removeListeners = () => {};
  if (signal) {
    if (globalThis.AbortSignal.any) {
      operationSignal = globalThis.AbortSignal.any([signal, timeoutController.signal]);
    } else {
      const controller = new globalThis.AbortController();
      const abort = () => controller.abort();
      signal.addEventListener('abort', abort, { once: true });
      timeoutController.signal.addEventListener('abort', abort, { once: true });
      removeListeners = () => {
        signal.removeEventListener('abort', abort);
        timeoutController.signal.removeEventListener('abort', abort);
      };
      operationSignal = controller.signal;
    }
  } else {
    operationSignal = timeoutController.signal;
  }

  return {
    signal: operationSignal,
    get timedOut() {
      return timeoutController.signal.aborted && !signal?.aborted;
    },
    cleanup: () => {
      globalThis.clearTimeout(timeoutId);
      removeListeners();
    },
  };
};
