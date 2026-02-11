#!/usr/bin/env python3

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
TRAVAUX_DIR = ROOT / "travaux"
INFOS_DIR = ROOT / "infos"
OUT_PATH = TRAVAUX_DIR / "projects.json"

SECTION_RE = re.compile(r"^=(?P<key>[a-zA-Z0-9_\-]+)=$")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "project"


def parse_numbered_dirname(name: str) -> tuple[int, str]:
    # expected: "X. PROJECT_NAME"
    m = re.match(r"^(\d+)\s*\.\s*(.+)$", name)
    if not m:
        return (10**9, name)
    return (int(m.group(1)), m.group(2).strip())


def parse_info_txt(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}

    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()

    sections: dict[str, list[str]] = {}
    current_key: str | None = None

    for raw in lines:
        line = raw.rstrip("\n")

        if line.strip() == "==":
            current_key = None
            continue

        m = SECTION_RE.match(line.strip())
        if m:
            current_key = m.group("key")
            sections.setdefault(current_key, [])
            continue

        if current_key:
            sections[current_key].append(line)

    return {k: "\n".join(v).strip() for k, v in sections.items()}


def media_type_for(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in {".mp4", ".webm", ".mov"}:
        return "video"
    return "image"


def sort_media_key(path: Path) -> tuple[int, str]:
    # 1.png, 2.mp4 ... then by name
    m = re.match(r"^(\d+)", path.stem)
    n = int(m.group(1)) if m else 10**9
    return (n, path.name)


def build_infos_payload() -> dict[str, Any]:
    info_path = INFOS_DIR / "info.txt"
    info_data = parse_info_txt(info_path)
    photo = None

    for name in ["photo.png", "photo.jpg", "photo.jpeg"]:
        candidate = INFOS_DIR / name
        if candidate.exists():
            photo = f"../infos/{name}"
            break

    return {
        "main_body": info_data.get("main_body", ""),
        "photo": photo,
        "etsy": "https://www.etsy.com/shop/Pamplemoosse",
        "cv": "",
    }


def build_projects() -> list[dict[str, Any]]:
    projects: list[dict[str, Any]] = []

    if not TRAVAUX_DIR.exists():
        return projects

    for child in sorted([p for p in TRAVAUX_DIR.iterdir() if p.is_dir()], key=lambda p: parse_numbered_dirname(p.name)):
        number, display_name = parse_numbered_dirname(child.name)

        banner = child / "banner.png"
        banner_gif = child / "banner.gif"
        banner_video = None
        for ext in [".mp4", ".webm", ".mov"]:
            candidate = child / f"banner{ext}"
            if candidate.exists():
                banner_video = candidate
                break

        home = child / "home.png"
        home_gif = child / "home.gif"
        home_video = None
        for ext in [".mp4", ".webm", ".mov"]:
            candidate = child / f"home{ext}"
            if candidate.exists():
                home_video = candidate
                break
        
        info = child / "info.txt"

        info_data = parse_info_txt(info)
        title = info_data.get("title") or display_name

        media_files = []
        for f in child.iterdir():
            if not f.is_file():
                continue
            if f.name in {"banner.png", "banner.gif", "banner.mp4", "banner.webm", "banner.mov", "home.png", "home.gif", "home.mp4", "home.webm", "home.mov", "info.txt"}:
                continue
            if f.name.startswith("."):
                continue
            if f.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".webm", ".mov"}:
                continue
            media_files.append(f)

        media_files.sort(key=sort_media_key)

        rel_dir = f"travaux/{child.name}"

        # Prefer GIF over video, then image for banner and home
        banner_src = None
        banner_type = None
        if banner_gif.exists():
            banner_src = f"{rel_dir}/banner.gif"
            banner_type = "image"
        elif banner_video:
            banner_src = f"{rel_dir}/{banner_video.name}"
            banner_type = "video"
        elif banner.exists():
            banner_src = f"{rel_dir}/banner.png"
            banner_type = "image"
        
        home_src = None
        home_type = None
        if home_gif.exists():
            home_src = f"{rel_dir}/home.gif"
            home_type = "image"
        elif home_video:
            home_src = f"{rel_dir}/{home_video.name}"
            home_type = "video"
        elif home.exists():
            home_src = f"{rel_dir}/home.png"
            home_type = "image"

        project: dict[str, Any] = {
            "number": number,
            "name": display_name,
            "title": title,
            "slug": f"{number}-{slugify(display_name)}" if number != 10**9 else slugify(display_name),
            "dir": child.name,
            "banner": banner_src,
            "bannerType": banner_type,
            "home": home_src,
            "homeType": home_type,
            "main_body": info_data.get("main_body", ""),
            "infos": info_data.get("infos", ""),
            "media": [
                {"type": media_type_for(f), "src": f"{rel_dir}/{f.name}"} for f in media_files
            ],
        }

        # small nicety: attempt to extract year from infos
        year_match = re.search(r"\b(19\d{2}|20\d{2})\b", project["infos"])
        if year_match:
            project["year"] = int(year_match.group(1))

        projects.append(project)

    return projects


def main() -> None:
    projects = build_projects()
    payload = {
        "version": 1,
        "projects": projects,
        "infos": build_infos_payload(),
    }

    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(projects)} projects)")


if __name__ == "__main__":
    main()
