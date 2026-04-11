#!/usr/bin/env python3

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHOP_DIR = ROOT / "shop"
SHOP_ITEMS_DIR = SHOP_DIR / "items"
OUT_PATH = SHOP_DIR / "shop.json"

SECTION_RE = re.compile(r"^=(?P<key>[a-zA-Z0-9_\-]+)=$")


def parse_numbered_dirname(name: str) -> tuple[int, str]:
    m = re.match(r"^(\d+)\s*\.\s*(.+)$", name)
    if not m:
        return (10**9, name.strip())
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


def sort_image_key(path: Path) -> tuple[int, str]:
    m = re.match(r"^(\d+)", path.stem)
    n = int(m.group(1)) if m else 10**9
    return (n, path.name)


def build_items() -> list[dict]:
    items: list[dict] = []

    if not SHOP_ITEMS_DIR.exists():
        return items

    for child in sorted(
        [p for p in SHOP_ITEMS_DIR.iterdir() if p.is_dir()],
        key=lambda p: parse_numbered_dirname(p.name),
    ):
        number, display_name = parse_numbered_dirname(child.name)

        info_data = parse_info_txt(child / "info.txt")
        title = info_data.get("title") or display_name
        price = info_data.get("price", "")
        link = info_data.get("link", "")

        image_files = sorted(
            [
                f
                for f in child.iterdir()
                if f.is_file()
                and not f.name.startswith(".")
                and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
                and f.name != "info.txt"
            ],
            key=sort_image_key,
        )

        rel_dir = f"items/{child.name}"
        images = [f"{rel_dir}/{f.name}" for f in image_files]

        items.append(
            {
                "number": number,
                "name": display_name,
                "title": title,
                "price": price,
                "link": link,
                "images": images,
            }
        )

    return items


def build_bio() -> dict:
    info_data = parse_info_txt(SHOP_DIR / "info.txt")
    return {
        "main_body": info_data.get("main_body", ""),
        "shop1": info_data.get("shop1", ""),
        "shop2": info_data.get("shop2", ""),
    }


def main() -> None:
    items = build_items()
    payload = {
        "version": 1,
        "bio": build_bio(),
        "items": items,
    }

    OUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {OUT_PATH} ({len(items)} items)")


if __name__ == "__main__":
    main()
