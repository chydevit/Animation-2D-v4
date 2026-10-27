"""Write build/vox_km/jobs.json (VoxCPM2 worker input) from voices/khmer_lines.json."""
import json
import os

P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(f"{P}/voices/khmer_lines.json"))
jobs = {"voices": [], "lines": []}
for vid, v in d["voices"].items():
    jobs["voices"].append({"voice_id": vid, "design": v["design"], "sample_text": v["sample"], "out_wav": f"{P}/voices/{vid}.wav", "seed": v["seed"]})
for lid, (who, km, en) in d["lines"].items():
    jobs["lines"].append({"id": lid, "text": km, "ref_wav": f"{P}/voices/{who}.wav", "ref_text": d["voices"][who]["sample"],
                          "out_wav": f"{P}/build/vox_km/{lid}.wav", "seed": d.get("seeds", {}).get(lid, 7), "clone_mode": "ref"})
os.makedirs(f"{P}/build/vox_km", exist_ok=True)
json.dump(jobs, open(f"{P}/build/vox_km/jobs.json", "w"), ensure_ascii=False, indent=1)
print(len(jobs["voices"]), "voices,", len(jobs["lines"]), "lines")
