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
Proyek akan menggunakan arsitektur berbasis Service (*Controller-Service pattern*) untuk menjaga kode tetap rapi:
- `src/routes/` - Untuk mendefinisikan *endpoint* API (mengatur *path* dan *method*).
- `src/controllers/` - Menangani request dan response HTTP.
- `src/services/` - Tempat logika bisnis berada (misal: memanggil Gemini API, memproses data).
- `src/middlewares/` - Untuk fungsi *middleware* (misal: validasi Zod, konfigurasi Multer, *global error handler*).
- `src/utils/` - Fungsi-fungsi pembantu umum (*helper* seperti `AppError.js` dan standar HTTP response).
- `src/config/` - Konfigurasi aplikasi (seperti inisialisasi *client* Gemini).

## 3. Coding Standards & Best Practices
- **Prinsip Software Engineering:** Selalu terapkan **SOLID** (terutama *Single Responsibility Principle*), **DRY** (*Don't Repeat Yourself*), **YAGNI** (*You Aren't Gonna Need It*), dan **KISS** (*Keep It Simple, Stupid*).
- **Code Formatting Standards:**
  - Wajib ikuti aturan `.prettierrc` dan `.editorconfig` di akar proyek:
    - Indentasi: **2 spasi** (bukan tab).
    - Quote: **Single quote (`'`)** untuk JS.
    - Semicolon: **Wajib (`semi: true`)**.
    - Line Endings: **`LF`** (`\n`), hindari `CRLF` agar tidak terjadi *diff noise* antar OS / text editor / AI agent.
    - Trailing Comma: **ES5** (`es5`).
- **ES Modules:** Selalu gunakan sintaks `import` / `export`.
- **Asynchronous Code:** Gunakan `async/await` dan tangkap error menggunakan blok `try/catch`.
- **Clean Code:** Gunakan penamaan variabel, fungsi, dan file yang deskriptif dan konsisten (misal: *camelCase* untuk variabel/fungsi, *kebab-case* untuk nama file jika diperlukan).

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
  - Jangan menelan error (*swallow errors*). Teruskan error ke *global error handler middleware* Express.
  - Jangan sertakan *stack trace* internal di response produksi.

## 5. Input Validation (Zod)
- Semua data request (`req.body`, `req.query`, `req.params`) **wajib divalidasi** menggunakan **Zod** schema di layer `middlewares` sebelum masuk ke `controller`.

## 6. Aturan Integrasi Gemini & Security
- Isolasi logika yang berinteraksi langsung dengan `@google/genai` di dalam direktori `src/services/`. Jangan panggil API langsung dari dalam *controller*.
- **API Key Security:** Jangan pernah menaruh *API Key* secara statis (*hardcode*) di dalam kode. Selalu ambil dari `process.env`. Sediakan `.env.example` sebagai draf referensi.
- **File Management:** Karena kita menggunakan file upload (Multer), pastikan file sementara di-*cleanup* (dihapus) setelah diproses oleh Gemini. Pastikan folder `uploads/` dan `temp/` ada di `.gitignore`.

## 7. Workflow Kolaborasi & AI Verification Protocol
- **User (Anda):** Bertindak sebagai *Project Manager* & *Code Reviewer*. Memberikan *requirement*, memandu arah fitur, dan menyetujui perubahan.
- **AI (Saya):** Bertindak sebagai *Software Engineer*. Mengeksekusi penulisan kode, menyusun arsitektur, dan memastikan kode bebas bug.
- **Planning Mode:** Untuk perubahan arsitektural atau fitur besar, AI wajib membuat `implementation_plan.md` untuk di-*review* oleh User sebelum mulai membuat kode.
- **AI Verification Protocol:** Sebelum menyatakan fitur selesai, AI **wajib** melakukan uji coba rute / endpoint secara lokal untuk memastikan server tidak crash dan merespons dengan benar.
- **Living Documentation:** AI **WAJIB** memperbarui file `gemini.md` ini secara otomatis setiap kali ada keputusan arsitektural baru, tambahan *library* penting, atau perubahan *guidelines*.

## 8. Implemented Endpoints
- `GET /api-docs` - Interactive Swagger API documentation UI.
- `POST /generate-text` - Generates text response from user prompt using Gemini AI.
- `POST /generate-from-image` - Accepts single image file (`image`) and optional `prompt`, returns generated text.
- `POST /generate-from-document` - Accepts document file (`document` or `file`: PDF, TXT, DOCX, etc.) and optional `prompt`, converts document to Base64, calls Gemini AI multimodal `generateContent()`, cleans up temporary file, and returns summary or analysis text in JSON.
- `POST /generate-from-audio` - Accepts audio file (`audio` or `file`: MP3, WAV, OGG, FLAC, AAC, M4A, etc.) and optional `prompt`, converts audio to Base64, calls Gemini AI multimodal `generateContent()`, cleans up temporary file, and returns transcription or audio analysis text in JSON.


