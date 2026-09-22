# Agent Guide

## Verification

- Run `node --test` and the local ESLint binary before committing.
- Do not call Gemini from tests; mock provider boundaries instead.
- Preserve temporary-file cleanup on success, validation errors, provider errors, timeout, and client cancellation.

## Request cancellation and timeout

- `req.clientAbortSignal` represents only a client disconnect.
- Service calls may accept `{ signal, timeoutMs }` as optional config.
- The default timeout is `GEMINI_TIMEOUT_MS` (60 seconds by default).
- Client disconnects are silent; internal timeouts return HTTP 504 with code `TIMEOUT`.
- Never expose `timeoutMs` or memory controls through public request bodies.

## Upload security

- Multer MIME and filename values are untrusted.
- Uploaded media must pass content-signature validation before Gemini processing.
- Keep upload size limits and always remove temporary files after processing.
