from pathlib import Path

p = Path(r"documents/connections/False Story.web.drawio.xml")
t = p.read_text(encoding="utf-8", errors="ignore")
print("mb", round(p.stat().st_size / 1e6, 2))
print("data_image", t.count("data:image"))
print("mxCell", t.count("<mxCell"))
print("vertex", t.count('vertex="1"'))
print("edge", t.count('edge="1"'))
print("starts", t[:90].replace("\n", " "))
print("has_mxfile", "<mxfile" in t)
print("has_diagram", "<diagram" in t)
