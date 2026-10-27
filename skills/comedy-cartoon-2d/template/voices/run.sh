#!/bin/sh
# Synthesise missing voices/lines with VoxCPM2 (local, Apple MPS). ~1-2 min model load + ~10-60 s per line.
# Uses the VoxCPM2 venv from the khmer-2d-animation skill unless VOX_PY points elsewhere.
cd "$(dirname "$0")/.." || exit 1
VOX_PY="${VOX_PY:-$HOME/.claude/skills/khmer-2d-animation/.venv-vox/bin/python}"
if [ ! -x "$VOX_PY" ]; then
  echo "VoxCPM2 python not found at $VOX_PY. Run ~/.claude/skills/khmer-2d-animation/scripts/setup.sh, or set VOX_PY." >&2
  exit 1
fi
python3 voices/make_jobs.py || exit 1
"$VOX_PY" voices/tts_vox.py build/vox/jobs.json 2>&1 | grep -E '^\{' | tee build/vox/log.txt
