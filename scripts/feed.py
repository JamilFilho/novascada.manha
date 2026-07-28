#!/usr/bin/env python3
"""
feed.py — lê um feed RSS (Substack) e gera um arquivo .mdx para cada item.

Uso:
    python feed.py <url_do_feed> <pasta_destino>

Exemplo:
    python feed.py "https://cadamanha.substack.com/feed?sectionId=303118" ./content/devocionais
"""

import re
import sys
import html
from pathlib import Path
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse, parse_qs
from xml.etree import ElementTree as ET

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

NAMESPACES = {
    "dc": "http://purl.org/dc/elements/1.1/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "atom": "http://www.w3.org/2005/Atom",
    "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
    "googleplay": "http://www.google.com/schemas/play-podcasts/1.0",
}


def fetch_feed(source: str) -> str:
    """Baixa o feed de uma URL ou lê de um arquivo local."""
    if source.startswith("http://") or source.startswith("https://"):
        resp = requests.get(source, timeout=30, headers={"User-Agent": "feed.py/1.0"})
        resp.raise_for_status()
        return resp.text
    return Path(source).read_text(encoding="utf-8")


def text_of(el, path):
    """Retorna o texto (já sem espaços nas pontas, com entidades HTML decodificadas)
    de um sub-elemento, ou ''. Feeds do Substack frequentemente trazem entidades
    (ex: &#237;) como texto literal dentro do CDATA, então decodificamos aqui."""
    found = el.find(path, NAMESPACES)
    if found is None or found.text is None:
        return ""
    return html.unescape(found.text.strip())


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\-\s]", "", value)
    value = re.sub(r"[\s_]+", "-", value)
    value = re.sub(r"-{2,}", "-", value)
    return value.strip("-")


def format_date(pub_date: str) -> str:
    if not pub_date:
        return ""
    try:
        dt = parsedate_to_datetime(pub_date)
        return dt.strftime("%Y-%m-%d")
    except (TypeError, ValueError):
        return ""


def yaml_escape(value: str) -> str:
    """Troca aspas duplas por aspas simples, para poder envolver o valor em ' " " '."""
    return value.replace('"', "'").strip()


def section_id_from_url(feed_url: str) -> str:
    if not feed_url.startswith("http"):
        return ""
    query = parse_qs(urlparse(feed_url).query)
    return query.get("sectionId", [""])[0]


def slug_from_channel_link(channel_link: str) -> str:
    """https://.../s/o-fruto-do-espirito -> o-fruto-do-espirito"""
    path = urlparse(channel_link).path
    marker = "/s/"
    if marker in path:
        return path.split(marker, 1)[1].strip("/")
    return path.strip("/").split("/")[-1]


def slug_from_item_link(item_link: str) -> str:
    """https://.../p/dia-10-... -> dia-10-..."""
    path = urlparse(item_link).path.strip("/")
    return path.split("/")[-1] if path else "item"


REFERENCE_RE = re.compile(
    r"""
    (?P<book>[1-3]?\s?[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)?)  # livro (ex: Gálatas, 1 Coríntios)
    \s+
    (?P<chapter>\d+)
    :
    (?P<verse>[\d,;\-\s]+)
    """,
    re.VERBOSE,
)


def extract_reference(description: str) -> dict:
    """Extrai livro/capítulo/versículo de uma descrição como:
    '"..." – Gálatas 5:22,23 (NVI)'
    """
    # pega o trecho depois do último travessão/hífen que precede a referência
    parts = re.split(r"[–—-]\s*(?=[1-3]?\s?[A-Za-zÀ-ÿ])", description)
    candidate = parts[-1] if parts else description
    match = REFERENCE_RE.search(candidate) or REFERENCE_RE.search(description)
    if not match:
        return {"book": "", "chapter": "", "verse": ""}
    book = match.group("book").strip()
    chapter = match.group("chapter").strip()
    verse = match.group("verse").strip().rstrip(",;-").strip()
    return {"book": book, "chapter": chapter, "verse": verse}


def clean_content(content_html: str) -> str:
    """Converte content:encoded em markdown, ignorando a imagem de capa."""
    soup = BeautifulSoup(content_html, "html.parser")

    for img_div in soup.find_all("div", class_="captioned-image-container"):
        img_div.decompose()

    markdown_text = md(str(soup), heading_style="ATX", bullets="-")

    # remove linhas em branco excessivas geradas na conversão
    markdown_text = re.sub(r"\n{3,}", "\n\n", markdown_text)
    return markdown_text.strip()


def build_frontmatter(item: dict, channel: dict, reference: dict) -> str:
    lines = [
        "---",
        f'title: "{yaml_escape(item["title"])}"',
        f'author: "{yaml_escape(item["author"])}"',
        f'description: "{yaml_escape(item["description"])}"',
        f'date: "{item["date"]}"',
        f'substack: "{item["link"]}"',
        "section:",
        f'  id: "{channel["id"]}"',
        f'  title: "{yaml_escape(channel["title"])}"',
        f'  description: "{yaml_escape(channel["description"])}"',
        f'  slug: "{channel["slug"]}"',
        "reference:",
        f'  book: "{yaml_escape(reference["book"])}"',
        f'  chapter: "{yaml_escape(reference["chapter"])}"',
        f'  verse: "{yaml_escape(reference["verse"])}"',
        "---",
    ]
    return "\n".join(lines)


def parse_feed(xml_text: str):
    root = ET.fromstring(xml_text)
    channel_el = root.find("channel")

    channel = {
        "title": text_of(channel_el, "title"),
        "description": text_of(channel_el, "description"),
        "link": text_of(channel_el, "link"),
    }
    channel["slug"] = slug_from_channel_link(channel["link"])

    items = []
    for item_el in channel_el.findall("item"):
        content_encoded = item_el.find("content:encoded", NAMESPACES)
        content_html = content_encoded.text if content_encoded is not None else ""

        items.append(
            {
                "title": text_of(item_el, "title"),
                "author": text_of(item_el, "dc:creator"),
                "description": text_of(item_el, "description"),
                "link": text_of(item_el, "link"),
                "date": format_date(text_of(item_el, "pubDate")),
                "content_html": content_html or "",
            }
        )

    return channel, items


def main():
    if len(sys.argv) != 3:
        print("Uso: python feed.py <url_do_feed> <pasta_destino>")
        sys.exit(1)

    feed_source, dest_folder = sys.argv[1], sys.argv[2]

    dest_path = Path(dest_folder)
    dest_path.mkdir(parents=True, exist_ok=True)

    xml_text = fetch_feed(feed_source)
    channel, items = parse_feed(xml_text)
    channel["id"] = section_id_from_url(feed_source)

    if not items:
        print("Nenhum item encontrado no feed.")
        return

    for item in items:
        reference = extract_reference(item["description"])
        frontmatter = build_frontmatter(item, channel, reference)
        body = clean_content(item["content_html"])

        mdx_content = f"{frontmatter}\n\n{body}\n"

        filename = slug_from_item_link(item["link"]) + ".mdx"
        out_file = dest_path / filename
        out_file.write_text(mdx_content, encoding="utf-8")
        print(f"Gerado: {out_file}")


if __name__ == "__main__":
    main()