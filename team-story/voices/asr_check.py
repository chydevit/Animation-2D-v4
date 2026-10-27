"""Khmer Whisper QC: transcribe every dialogue clip and score it against the script (character similarity).
Run with the VoxCPM venv:  $VOX_PY voices/asr_check.py   -> prints a table, writes build/vox/asr.json
Low scores (< ~0.6) are worth re-rolling with a new seed in lines.json "seeds"."""
import difflib, json, os, re, sys
import soundfile as sf, numpy as np
from transformers import pipeline

P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(f"{P}/voices/lines.json"))
asr = pipeline("automatic-speech-recognition", model="seanghay/whisper-small-khmer-v2", device="mps")
norm = lambda s: re.sub(r"[\s​។!?,.()…\-]|[A-Za-z]", "", s)
out = {}
for lid, line in d["lines"].items():
    wav = f"{P}/build/vox/{lid}.wav"
    if not os.path.exists(wav): continue
    x, sr = sf.read(wav, dtype="float32")
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != 16000:
        n = int(len(x) * 16000 / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    heard = asr({"raw": x, "sampling_rate": 16000})["text"]
    ref = line[3] if len(line) > 3 and line[3] else line[1]
    score = difflib.SequenceMatcher(None, norm(ref), norm(heard)).ratio()
    out[lid] = {"score": round(score, 2), "heard": heard}
    print(f"{lid:4} {score:.2f}  {'LOW ' if score < 0.6 else '    '}{heard}", flush=True)
json.dump(out, open(f"{P}/build/vox/asr.json", "w"), ensure_ascii=False, indent=1)
