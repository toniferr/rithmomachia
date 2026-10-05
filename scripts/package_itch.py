"""Builds the itch.io upload: dist/rithmomachia-itch.zip with index.html at the root.

Usage: python3 scripts/package_itch.py

itch.io serves HTML games from its own domain inside an iframe; the site needs no changes for
that. The service worker's cache gets its own version (like the GitHub Pages deploy does), and
the font licences travel with the fonts, as the SIL OFL requires. Standard library only.
"""

import subprocess
import zipfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = ROOT / "dist" / "rithmomachia-itch.zip"


def version() -> str:
    try:
        sha = subprocess.run(["git", "rev-parse", "--short=12", "HEAD"], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        sha = "nogit"
    return f"itch-{sha}-{datetime.now(timezone.utc):%Y%m%d%H%M}"


def main() -> None:
    OUT.parent.mkdir(exist_ok=True)
    stamp = version()
    files = sorted(p for p in SITE.rglob("*") if p.is_file())
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for path in files:
            name = path.relative_to(SITE).as_posix()
            if name == "sw.js":
                z.writestr(name, path.read_text(encoding="utf-8").replace("__VERSION__", stamp))
            else:
                z.write(path, name)
    size = OUT.stat().st_size / 1024
    print(f"{OUT.relative_to(ROOT)}: {len(files)} files, {size:.0f} KB, cache {stamp}")


if __name__ == "__main__":
    main()
