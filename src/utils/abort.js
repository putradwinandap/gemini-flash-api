export const isAbortError = (error) =>
  error?.name === 'AbortError' || error?.code === 'ABORT_ERR' || error?.code === 'ERR_ABORTED';
