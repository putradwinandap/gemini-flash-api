export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Gemini Flash API',
    version: '1.0.0',
    description:
      'Express.js API integrating Google Gemini AI multimodal capabilities (Text, Image, Document, Audio).',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development Server',
    },
  ],
  paths: {
    '/generate-text': {
      post: {
        summary: 'Generate text response from user prompt',
        description: 'Sends a text prompt to Gemini AI and returns generated text response.',
        tags: ['Generative AI'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt'],
                properties: {
                  prompt: {
                    type: 'string',
                    example: 'Explain quantum computing in simple terms.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful text generation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Text generated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        text: { type: 'string', example: 'Quantum computing is...' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error or bad request',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/generate-from-image': {
      post: {
        summary: 'Generate text response from uploaded image',
        description:
          'Accepts an image file (`image`) and optional `prompt`, returns Gemini AI analysis or caption.',
        tags: ['Generative AI'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, WEBP, HEIC, HEIF)',
                  },
                  prompt: {
                    type: 'string',
                    example: 'Describe what you see in this image in detail.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful image analysis',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Text generated from image successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        text: { type: 'string', example: 'The image depicts...' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation or file upload error',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/generate-from-document': {
      post: {
        summary: 'Generate text summary or analysis from document',
        description:
          'Accepts a document file (`document` or `file`) and optional `prompt`, returns Gemini AI document analysis.',
        tags: ['Generative AI'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['document'],
                properties: {
                  document: {
                    type: 'string',
                    format: 'binary',
                    description: 'Document file (PDF, TXT, DOCX, etc.)',
                  },
                  prompt: {
                    type: 'string',
                    example: 'Summarize the key findings in this document.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful document analysis',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Text generated from document successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        text: { type: 'string', example: 'Summary of the document...' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation or file upload error',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/generate-from-audio': {
      post: {
        summary: 'Generate transcription or text response from audio file',
        description:
          'Accepts an audio file (`audio` or `file`) and optional `prompt`, returns audio analysis or transcription.',
        tags: ['Generative AI'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['audio'],
                properties: {
                  audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Audio file (MP3, WAV, OGG, FLAC, AAC, M4A)',
                  },
                  prompt: {
                    type: 'string',
                    example: 'Transcribe this audio recording verbatim.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful audio processing',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Text generated from audio successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        text: { type: 'string', example: 'Audio transcription content...' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation or file upload error',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
  },
};
