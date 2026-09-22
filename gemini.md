# Project Guidelines (gemini-flash-api)

## 1. Tech Stack

- **Runtime:** Node.js (ES Modules / `type: "module"`)
- **Framework:** Express.js v5
- **AI SDK:** `@google/genai`
- **Validation:** Zod
- **File Upload:** Multer
- **API Documentation:** Swagger UI (`swagger-ui-express`)
- **Environment:** dotenv

## 2. Architecture & Directory Structure

Proyek akan menggunakan arsitektur berbasis Service (_Controller-Service pattern_) untuk menjaga kode tetap rapi:

- `src/routes/` - Untuk mendefinisikan _endpoint_ API (mengatur _path_ dan _method_).
- `src/controllers/` - Menangani request dan response HTTP.
- `src/services/` - Tempat logika bisnis berada (misal: memanggil Gemini API, memproses data).
- `src/middlewares/` - Untuk fungsi _middleware_ (misal: validasi Zod, konfigurasi Multer, _global error handler_).
- `src/utils/` - Fungsi-fungsi pembantu umum (_helper_ seperti `AppError.js` dan standar HTTP response).
- `src/config/` - Konfigurasi aplikasi (seperti inisialisasi _client_ Gemini).

## 3. Coding Standards & Best Practices

- **Prinsip Software Engineering:** Selalu terapkan **SOLID** (terutama _Single Responsibility Principle_), **DRY** (_Don't Repeat Yourself_), **YAGNI** (_You Aren't Gonna Need It_), dan **KISS** (_Keep It Simple, Stupid_).
- **Code Formatting Standards:**
  - Wajib ikuti aturan `.prettierrc` dan `.editorconfig` di akar proyek:
    - Indentasi: **2 spasi** (bukan tab).
    - Quote: **Single quote (`'`)** untuk JS.
    - Semicolon: **Wajib (`semi: true`)**.
    - Line Endings: **`LF`** (`\n`), hindari `CRLF` agar tidak terjadi _diff noise_ antar OS / text editor / AI agent.
    - Trailing Comma: **ES5** (`es5`).
- **ES Modules:** Selalu gunakan sintaks `import` / `export`.
- **Asynchronous Code:** Gunakan `async/await` dan tangkap error menggunakan blok `try/catch`.
- **Clean Code:** Gunakan penamaan variabel, fungsi, dan file yang deskriptif dan konsisten (misal: _camelCase_ untuk variabel/fungsi, _kebab-case_ untuk nama file jika diperlukan).

## 4. API Response & Error Handling Standards

- **Standard Response Format:**
  - **Success (HTTP 2xx):**
    ```json
    {
      "success": true,
      "message": "Pesan sukses deskriptif (opsional)",
      "data": { ... }
    }
    ```
  - **Error (HTTP 4xx / 5xx):**
    ```json
    {
      "success": false,
      "error": {
        "code": "BAD_REQUEST | NOT_FOUND | INTERNAL_ERROR | VALIDATION_ERROR",
        "message": "Pesan error deskriptif"
      }
    }
    ```
- **Global Error Handling & Custom AppError:**
  - Gunakan class `AppError` kustom untuk melempar error dengan HTTP status code spesifik.
  - Jangan menelan error (_swallow errors_). Teruskan error ke _global error handler middleware_ Express.
  - Jangan sertakan _stack trace_ internal di response produksi.

## 5. Input Validation (Zod)

- Semua data request (`req.body`, `req.query`, `req.params`) **wajib divalidasi** menggunakan **Zod** schema di layer `middlewares` sebelum masuk ke `controller`.

## 6. Aturan Integrasi Gemini & Security

- Isolasi logika yang berinteraksi langsung dengan `@google/genai` di dalam direktori `src/services/`. Jangan panggil API langsung dari dalam _controller_.
- **Interactions API:** Semua service memakai `ai.interactions.create({ model, input, generation_config, system_instruction, store, previous_interaction_id })` dan membaca output via `interaction.output_text` (fallback scan `steps[type=model_output]`). Default model `gemini-3.1-flash-lite`.
- **Memory Control:** `store` HANYA via ENV `GEMINI_STORE` atau code config `{ store }` (prioritas: kode > ENV). Tidak boleh via endpoint request body. Endpoint hanya menerima `previousInteractionId` opsional untuk chat bersambung.
- **API Key Security:** Jangan pernah menaruh _API Key_ secara statis (_hardcode_) di dalam kode. Selalu ambil dari `process.env`. Sediakan `.env.example` sebagai draf referensi.
- **File Management:** Karena kita menggunakan file upload (Multer), pastikan file sementara di-_cleanup_ (dihapus) setelah diproses oleh Gemini. Pastikan folder `uploads/` dan `temp/` ada di `.gitignore`.

## 7. Workflow Kolaborasi & AI Verification Protocol

- **User (Anda):** Bertindak sebagai _Project Manager_ & _Code Reviewer_. Memberikan _requirement_, memandu arah fitur, dan menyetujui perubahan.
- **AI (Saya):** Bertindak sebagai _Software Engineer_. Mengeksekusi penulisan kode, menyusun arsitektur, dan memastikan kode bebas bug.
- **Planning Mode:** Untuk perubahan arsitektural atau fitur besar, AI wajib membuat `implementation_plan.md` untuk di-_review_ oleh User sebelum mulai membuat kode.
- **AI Verification Protocol:** Sebelum menyatakan fitur selesai, AI **wajib** melakukan uji coba rute / endpoint secara lokal untuk memastikan server tidak crash dan merespons dengan benar.
- **Living Documentation:** AI **WAJIB** memperbarui file `gemini.md` ini secara otomatis setiap kali ada keputusan arsitektural baru, tambahan _library_ penting, atau perubahan _guidelines_.

## 8. Implemented Endpoints

- `GET /api-docs` - Interactive Swagger API documentation UI.
- `POST /generate-text` - Generates text response from user prompt using Gemini AI (Interactions API). Body: `prompt` + optional `previousInteractionId`. Returns `{ text, interactionId }`.
- `POST /generate-from-image` - Accepts single image file (`image`) and optional `prompt` + `previousInteractionId`, returns generated text + `interactionId`.
- `POST /generate-from-document` - Accepts document file (`document` or `file`: PDF, TXT, DOCX, etc.) and optional `prompt` + `previousInteractionId`, converts document to Base64, calls Gemini AI multimodal Interactions API, cleans up temporary file, and returns summary or analysis text in JSON.
- `POST /generate-from-audio` - Accepts audio file (`audio` or `file`: MP3, WAV, OGG, FLAC, AAC, M4A, etc.) and optional `prompt` + `previousInteractionId`, converts audio to Base64, calls Gemini AI multimodal Interactions API, cleans up temporary file, and returns transcription or audio analysis text in JSON.

## 9. Dual-Purpose Packaging Architecture

- **SDK Exports Entrypoint:** `src/index.js` (Exporting Services: `generateText`, `generateFromImage`, `generateFromDocument`, `generateFromAudio`, Express `app`, `ai`, and `AppError`).
- **Standalone Server Runner:** `src/server.js` (Invokes `app.listen` on `PORT`).
- **NPM Package Compatibility:** Supported via `"exports"` and `"files"` field in `package.json`, allowing direct import into Next.js Route Handlers (`app/api/...`) or existing Node.js projects without running an external HTTP server.

## 10. Configurable Generation Options (SDK)

- Semua fungsi service menerima parameter `config` opsional sebagai argumen kedua: `generateText(prompt, config)`, `generateFromImage({ ... }, config)`, dll.
- Logika merge config dipusatkan di `src/utils/generationConfig.js` (`buildGenerationConfig(config)`), output format Interactions API (`generation_config`, `system_instruction`, `store`, `previous_interaction_id`).
- **Memory:** `store` hanya via ENV `GEMINI_STORE` atau `config.store` di kode (kode menang). Response service selalu `{ text, interactionId }`.
- **Opsi yang didukung** (semua opsional):
  - `model` — override nama model Gemini per-call.
  - `temperature` — tingkat kreativitas (0.0 – 2.0).
  - `maxOutputTokens` — batas token output.
  - `topP` — nucleus sampling (0.0 – 1.0).
  - `topK` — top-K sampling.
  - `systemInstruction` — instruksi sistem yang diprepend ke setiap request.
  - `stopSequences` — array string sebagai stop sequence.
- **HTTP endpoint tidak terpengaruh** — `config` hanya tersedia untuk pengguna SDK, tidak diekspos ke REST API.
- **Backward-compatible** — controller yang tidak meneruskan `config` akan otomatis menggunakan default dari environment variable.

## 12. Cancellation, Timeout, dan Upload Security

- `req.clientAbortSignal` hanya merepresentasikan client disconnect; jangan gunakan signal timeout sebagai indikator disconnect.
- Default timeout dikontrol oleh `GEMINI_TIMEOUT_MS` (default 60000 ms) dan dapat dioverride oleh service caller melalui `config.timeoutMs`.
- Client disconnect diproses silent; timeout internal menghasilkan HTTP 504 dengan code `TIMEOUT`.
- `config.timeoutMs` dan `config.signal` hanya tersedia untuk pemanggil service/package, bukan request body REST.
- File upload wajib melewati validasi content signature sebelum dikirim ke Gemini; MIME type dan filename dari client dianggap tidak tepercaya.
- Temporary upload files harus selalu dibersihkan pada success, error, timeout, dan cancellation.

## 11. Automated Quality Gate

- Quality gate lokal wajib dijalankan dengan `npm run verify` sebelum push.
- Quality gate mencakup Prettier, ESLint, test suite, dan `npm audit --audit-level=high`.
- Test default menggunakan mock dan tidak memanggil Gemini API atau membutuhkan `GEMINI_API_KEY`.
- Husky menjalankan lint-staged pada pre-commit dan `npm run verify` pada pre-push.
- GitHub Actions menjalankan workflow yang sama pada push ke `main` dan setiap pull request.
- Branch protection direkomendasikan mewajibkan status check `Verify` sebelum merge.
