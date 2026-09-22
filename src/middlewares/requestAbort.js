export const requestAbort = (req, res, next) => {
  const controller = new globalThis.AbortController();
  let settled = false;
  const abort = () => {
    if (!controller.signal.aborted) controller.abort();
  };
  const onClose = () => {
    if (!req.complete && !settled && !res.writableEnded) abort();
  };
  const cleanup = () => {
    settled = true;
    req.removeListener('aborted', abort);
    req.removeListener('close', onClose);
    res.removeListener('finish', cleanup);
    res.removeListener('close', cleanup);
  };
  req.on('aborted', abort);
  req.on('close', onClose);
  res.on('finish', cleanup);
  res.on('close', cleanup);
  req.clientAbortSignal = controller.signal;
  next();
};
