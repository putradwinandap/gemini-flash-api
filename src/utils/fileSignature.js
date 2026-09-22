import fs from 'fs/promises';

const startsWith = (buffer, values) =>
  values.some((value) => buffer.subarray(0, value.length).equals(value));

export const hasValidFileSignature = async (file, kind) => {
  const handle = await fs.open(file.path, 'r');
  try {
    const buffer = Buffer.alloc(512);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const bytes = buffer.subarray(0, bytesRead);

    if (kind === 'image') {
      return (
        startsWith(bytes, [
          Buffer.from([0xff, 0xd8, 0xff]),
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
          Buffer.from('GIF8'),
          Buffer.from('BM'),
        ]) ||
        (bytes.subarray(0, 12).toString('ascii', 0, 4) === 'RIFF' &&
          bytes.subarray(8, 12).toString('ascii') === 'WEBP')
      );
    }

    if (kind === 'audio') {
      return (
        startsWith(bytes, [
          Buffer.from('ID3'),
          Buffer.from('OggS'),
          Buffer.from('fLaC'),
          Buffer.from([0xff, 0xfb]),
          Buffer.from([0xff, 0xf3]),
          Buffer.from([0xff, 0xf2]),
        ]) ||
        (bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
          bytes.subarray(8, 12).toString('ascii') === 'WAVE') ||
        bytes.subarray(4, 8).toString('ascii') === 'ftyp'
      );
    }

    if (kind === 'document') {
      const isKnownBinary = startsWith(bytes, [
        Buffer.from('%PDF-'),
        Buffer.from([0xd0, 0xcf, 0x11, 0xe0]),
        Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      ]);
      const isText = !bytes.includes(0) && bytes.toString('utf8').trim().length > 0;
      return isKnownBinary || isText;
    }

    return false;
  } finally {
    await handle.close();
  }
};
