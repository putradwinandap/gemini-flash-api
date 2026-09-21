# Gemini Flash API 🚀

An Express.js (v5) RESTful API powered by Google's `@google/genai` SDK, designed to process multimodal AI interactions including **Text Generation**, **Image Analysis**, **Document Summarization**, and **Audio Processing**.

---

## 🌟 Key Features

- **Text Generation:** Fast and intelligent responses using Gemini AI models (`POST /generate-text`).
- **Image Multimodal Analysis:** Analyze images (JPEG, PNG, WEBP, HEIC, HEIF) with custom prompts (`POST /generate-from-image`).
- **Document Summarization & Extraction:** Support for documents (PDF, TXT, DOCX, etc.) processing (`POST /generate-from-document`).
- **Audio Processing & Transcription:** Analyze and transcribe audio files (MP3, WAV, OGG, FLAC, AAC, M4A) (`POST /generate-from-audio`).
- **Interactive Swagger Documentation:** Built-in Swagger UI available at `/api-docs`.
- **Robust Architecture:** Clean Controller-Service architecture with Zod schema validations and centralized error handling.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5
- **AI SDK:** `@google/genai`
- **Validation:** Zod
- **File Uploads:** Multer
- **API Documentation:** Swagger UI (`swagger-ui-express`)
- **Environment Management:** `dotenv`

---

## 📂 Project Structure

```text
gemini-flash-api/
├── src/
│   ├── config/          # Client & Swagger configurations
│   ├── controllers/     # Request handlers & HTTP responses
│   ├── middlewares/     # Zod validation, Multer upload & Error handlers
│   ├── routes/          # Express route definitions
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Gemini AI business logic
│   ├── utils/           # Custom error helpers & response formatters
│   ├── app.js           # Express app setup & middleware stack
│   └── index.js         # Server entrypoint
├── .env.example         # Environment template
├── GEMINI.md            # Guidelines & Living project documentation
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites

- Node.js (v18+ recommended)
- Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/putradwinandap/gemini-flash-api.git
cd gemini-flash-api
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

Server will start on `http://localhost:3000`.

---

## 📦 Using as NPM Dependency in Next.js / Express Apps

You can also install `gemini-flash-api` directly into your Next.js or Node.js project as a dependency:

### 1. Install
```bash
npm install git+https://github.com/putradwinandap/gemini-flash-api.git
```

### 2. Usage in Next.js Route Handler (`app/api/gemini/route.ts` or `.js`)

```javascript
import { generateText, generateFromImage } from 'gemini-flash-api';

export async function POST(req) {
  const { prompt } = await req.json();
  const text = await generateText(prompt);
  
  return Response.json({ success: true, text });
}
```

### 3. Usage in an existing Express App

```javascript
import express from 'express';
import { generateText } from 'gemini-flash-api';

const app = express();

app.post('/api/ai-text', async (req, res) => {
  const text = await generateText(req.body.prompt);
  res.json({ text });
});
```

---

## 📖 API Documentation & Swagger UI

Interactive Swagger API documentation is available at:
👉 **`http://localhost:3000/api-docs`**

---

## 📡 API Endpoints Summary

### 1. Text Generation
- **Endpoint:** `POST /generate-text`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "prompt": "Explain quantum computing in simple terms."
  }
  ```

### 2. Image Analysis
- **Endpoint:** `POST /generate-from-image`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `image`: *(File)* Image file
  - `prompt`: *(Text, optional)* Instructions for image analysis

### 3. Document Analysis
- **Endpoint:** `POST /generate-from-document`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `document` or `file`: *(File)* PDF, TXT, DOCX, etc.
  - `prompt`: *(Text, optional)* Instructions for document processing

### 4. Audio Processing
- **Endpoint:** `POST /generate-from-audio`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `audio` or `file`: *(File)* MP3, WAV, OGG, FLAC, AAC, M4A, etc.
  - `prompt`: *(Text, optional)* Transcription or analysis instructions

---

## 🛡️ Response Format Standard

### Success (HTTP 2xx)
```json
{
  "success": true,
  "message": "Text generated successfully",
  "data": {
    "text": "Generated AI output string..."
  }
}
```

### Error (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST | NOT_FOUND | INTERNAL_ERROR | VALIDATION_ERROR",
    "message": "Detailed error message"
  }
}
```

---

## 📜 License

Distributed under the ISC License.
