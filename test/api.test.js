import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import request from 'supertest';
import { generateTextSchema } from '../src/schemas/textSchema.js';
import { documentUploadHandler } from '../src/routes/documentRoutes.js';
import { audioUploadHandler } from '../src/routes/audioRoutes.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { AppError } from '../src/utils/AppError.js';
import { extractOutputText } from '../src/utils/interactionHelper.js';
import { buildGenerationConfig } from '../src/utils/generationConfig.js';
import { cleanupUploadedFiles } from '../src/utils/uploadCleanup.js';

const createUploadApp = (uploadHandler) => {
  const app = express();

  app.post('/upload', uploadHandler, async (req, res, next) => {
    try {
      const fieldname = req.file?.fieldname;
      await cleanupUploadedFiles(req);
      return res.status(200).json({ fieldname });
    } catch (error) {
      return next(error);
    }
  });

  app.use(errorHandler);
  return app;
};

test('document upload accepts both documented field aliases', async (t) => {
  for (const fieldname of ['document', 'file']) {
    await t.test(fieldname, async () => {
      const response = await request(createUploadApp(documentUploadHandler))
        .post('/upload')
        .attach(fieldname, Buffer.from('hello'), 'notes.txt');

      assert.equal(response.status, 200);
      assert.equal(response.body.fieldname, fieldname);
    });
  }
});

test('audio upload accepts both documented field aliases', async (t) => {
  for (const fieldname of ['audio', 'file']) {
    await t.test(fieldname, async () => {
      const response = await request(createUploadApp(audioUploadHandler))
        .post('/upload')
        .attach(fieldname, Buffer.from('audio'), 'clip.mp3');

      assert.equal(response.status, 200);
      assert.equal(response.body.fieldname, fieldname);
    });
  }
});

test('document and audio uploads reject two files', async (t) => {
  for (const [name, handler, filename, contentType] of [
    ['document', documentUploadHandler, 'a.txt', 'text/plain'],
    ['audio', audioUploadHandler, 'a.mp3', 'audio/mpeg'],
  ]) {
    await t.test(name, async () => {
      const response = await request(createUploadApp(handler))
        .post('/upload')
        .attach(name, Buffer.from('one'), filename, { contentType })
        .attach('file', Buffer.from('two'), filename, { contentType });

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    });
  }
});

test('strict body validation rejects unknown fields without rejecting query or params', async () => {
  await assert.rejects(
    generateTextSchema.parseAsync({
      body: { prompt: 'hello', unsupported: true },
      query: {},
      params: {},
    })
  );

  const parsed = await generateTextSchema.parseAsync({
    body: { prompt: 'hello' },
    query: {},
    params: {},
  });
  assert.equal(parsed.body.prompt, 'hello');
});

test('generation config and output extraction support memory and fallback output', () => {
  const config = buildGenerationConfig({
    store: true,
    previousInteractionId: 'int_previous',
    temperature: 0.4,
    maxOutputTokens: 100,
  });

  assert.equal(config.store, true);
  assert.equal(config.previous_interaction_id, 'int_previous');
  assert.deepEqual(config.generation_config, { temperature: 0.4, maxOutputTokens: 100 });
  assert.equal(
    extractOutputText({
      steps: [{ type: 'model_output', content: [{ type: 'text', text: 'fallback' }] }],
    }),
    'fallback'
  );
});

test('cleanup removes uploaded file paths and tolerates missing files', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-api-test-'));
  const filePath = path.join(tempDir, 'upload.txt');
  await fs.writeFile(filePath, 'temporary');

  await cleanupUploadedFiles({ file: { path: filePath } });
  await assert.rejects(fs.access(filePath));
  await cleanupUploadedFiles({ file: { path: filePath } });
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('validation errors after upload still clean up the temporary file', async () => {
  const app = express();
  app.post(
    '/upload',
    documentUploadHandler,
    (_req, _res, next) => next(new AppError('Invalid request', 400, 'VALIDATION_ERROR')),
    errorHandler
  );

  const response = await request(app)
    .post('/upload')
    .attach('file', Buffer.from('temporary'), 'notes.txt');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('production error responses hide internal provider details', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  const app = express();
  app.get('/error', () => {
    throw new Error('secret provider response');
  });
  app.use(errorHandler);

  try {
    const response = await request(app).get('/error');
    assert.equal(response.status, 500);
    assert.equal(response.body.error.message, 'An unexpected server error occurred');
    assert.equal(response.body.error.message.includes('secret'), false);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
});

test('SDK exports remain importable without making a Gemini request', async () => {
  const sdk = await import('../src/index.js');
  assert.equal(typeof sdk.generateText, 'function');
  assert.equal(typeof sdk.generateFromDocument, 'function');
  assert.equal(typeof sdk.generateFromAudio, 'function');
});
