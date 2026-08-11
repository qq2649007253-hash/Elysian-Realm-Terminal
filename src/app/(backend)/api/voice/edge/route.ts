import { EdgeSpeechPayload, EdgeSpeechTTS } from '@lobehub/tts';

// EdgeSpeechTTS opens a WebSocket connection to Microsoft's speech service.
// The Next.js Edge runtime can recurse while handling a failed WebSocket in
// local development, so use the Node.js runtime for a stable failure path.
export const runtime = 'nodejs';

export const POST = async (req: Request) => {
  const payload = (await req.json()) as EdgeSpeechPayload;

  return await EdgeSpeechTTS.createRequest({ payload });
};
