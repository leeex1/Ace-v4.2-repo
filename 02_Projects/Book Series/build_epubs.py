#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build EPUB3 files from the finished-draft markdown novels.

Usage:  python build_epubs.py            (builds all 5 into ./epubs/)
        python build_epubs.py --book 1   (Book 1 only)

Each H2 (`## ...`) starts a new chapter file. Minimal Markdown -> XHTML:
headings, paragraphs, **bold**, *italic*, lists, blockquotes, hr.
Author/cover left unset on purpose — set AUTHOR below when confirmed.
"""
import html
import re
import sys
from pathlib import Path

from ebooklib import epub

HERE = Path(__file__).resolve().parent
SRC = HERE / "finished drafts"
OUT = HERE / "epubs"
AUTHOR = ""  # TODO: confirm byline with leeex1 before publishing

BOOKS = [
    ("Book 1 - Twisted Destiny.md", "Twisted Destiny", "Quillan-Ronin Saga, Book 1"),
    ("Book 2 - Rise of Ascension.md", "Rise of Ascension", "Quillan-Ronin Saga, Book 2"),
    ("Book 3 - Battle Grandeur.md", "Battle Grandeur", "Quillan-Ronin Saga, Book 3"),
    ("Book 4 - Fall of Empires.md", "Fall of Empires", "Quillan-Ronin Saga, Book 4"),
    ("Book 5 - Shadows That Speak.md", "Shadows That Speak", "Quillan-Ronin Saga, Book 5"),
]

INLINE = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"(?<!\*)\*([^*\n]+)\*(?!\*)"), r"<em>\1</em>"),
    (re.compile(r"!\[.*?\]\(.*?\)"), ""),  # local image refs don't resolve in EPUB; drop
]


def md_inline(text: str) -> str:
    text = html.escape(text)
    for pat, rep in INLINE:
        text = pat.sub(rep, text)
    return text


def md_to_xhtml(body_lines) -> str:
    """Block-level: #/##/### headings, -/* lists, > quotes, --- hr, paragraphs."""
    out, in_list, para = [], False, []
    def flush_para():
        if para:
            out.append("<p>" + "<br/>".join(md_inline(l) for l in para) + "</p>")
            para.clear()
    for raw in body_lines:
        line = raw.rstrip()
        if not line.strip():
            flush_para()
            if in_list:
                out.append("</ul>")
                in_list = False
            continue
        m = re.match(r"^(#{1,3})\s+(.*)$", line)
        if m:
            flush_para()
            if in_list:
                out.append("</ul>")
                in_list = False
            lvl = len(m.group(1))
            out.append(f"<h{lvl}>{md_inline(m.group(2))}</h{lvl}>")
            continue
        if re.match(r"^---+\s*$", line):
            flush_para()
            out.append("<hr/>")
            continue
        if line.lstrip().startswith(">"):
            flush_para()
            out.append(f"<blockquote><p>{md_inline(line.lstrip()[1:].strip())}</p></blockquote>")
            continue
        if re.match(r"^\s*[-*]\s+", line):
            flush_para()
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{md_inline(re.sub(r'^\\s*[-*]\\s+', '', line))}</li>")
            continue
        if re.match(r"^\s*\d+\.\s+", line):
            flush_para()
            out.append(f"<p>{md_inline(line.strip())}</p>")
            continue
        para.append(line.strip())
    flush_para()
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def split_chapters(text: str):
    """Returns (front_matter_title, [(heading, lines)]). H1 = book title page."""
    lines = text.splitlines()
    # strip YAML frontmatter
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                lines = lines[i + 1:]
                break
    # drop author TOC block (we generate a real NCX/nav from H2s)
    chunks, cur_head, cur = [], None, []
    for line in lines:
        m = re.match(r"^##\s+(.*)$", line)
        if m:
            if cur_head is not None or cur:
                chunks.append((cur_head or "Front Matter", cur))
            cur_head, cur = m.group(1).strip(), []
        else:
            cur.append(line)
    if cur_head is not None or cur:
        chunks.append((cur_head or "Front Matter", cur))
    return chunks


def build_epub(src_file: Path, title: str, series: str) -> Path:
    text = src_file.read_text(encoding="utf-8", errors="replace")
    chunks = split_chapters(text)
    book = epub.EpubBook()
    book.set_identifier(f"quillan-ronin-{series.split(', Book ')[-1]}-{src_file.stem}")
    book.set_title(title)
    book.set_language("en")
    if AUTHOR:
        book.add_author(AUTHOR)
    book.add_metadata("DC", "description", series)

    items, toc = [], []
    for i, (heading, lines) in enumerate(chunks):
        # skip the pasted Table-of-Contents chapter (we build a real nav)
        if i == 0 and "table of contents" in (heading or "").lower():
            continue
        c = epub.EpubHtml(title=heading, file_name=f"chap_{i:02d}.xhtml", lang="en")
        body = md_to_xhtml([f"## {heading}"] + lines if heading != "Front Matter" else lines)
        c.content = f"<html><body>{body}</body></html>"
        book.add_item(c)
        items.append(c)
        toc.append(c)
    book.toc = tuple(toc)
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    book.spine = ["nav"] + items

    OUT.mkdir(exist_ok=True)
    dest = OUT / (src_file.stem + ".epub")
    epub.write_epub(str(dest), book)
    return dest


def main():
    only = None
    if "--book" in sys.argv:
        only = int(sys.argv[sys.argv.index("--book") + 1])
    for i, (fname, title, series) in enumerate(BOOKS, 1):
        if only and i != only:
            continue
        src = SRC / fname
        dest = build_epub(src, title, series)
        kb = dest.stat().st_size // 1024
        print(f"Book {i}: {dest.name} ({kb} KB)")


if __name__ == "__main__":
    main()
