// Generate per-line voiceover on fal.ai (ElevenLabs multilingual v2, voice George).
// Usage: FAL_KEY=... node tools/vo.mjs [id ...]   (key read from Railway at run time; never stored)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const KEY = process.env.FAL_KEY; if (!KEY) throw new Error('FAL_KEY missing');
const lines = JSON.parse(readFileSync(new URL('../lines.json', import.meta.url)));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(lines);
for (const id of ids) {
  const out = new URL(`../audio/vo/${id}.mp3`, import.meta.url);
  if (existsSync(out) && !process.env.FORCE) { console.log(id, 'exists'); continue; }
  const r = await fetch('https://fal.run/fal-ai/elevenlabs/tts/multilingual-v2', {
    method: 'POST', headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines[id], voice: 'George', stability: 0.6, similarity_boost: 0.75, speed: 0.92 }),
  });
  const j = await r.json(); if (!j.audio?.url) throw new Error(id + ' ' + JSON.stringify(j));
  writeFileSync(out, Buffer.from(await (await fetch(j.audio.url)).arrayBuffer()));
  console.log(id, 'ok');
}
