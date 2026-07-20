import xml.etree.ElementTree as ET
import unicodedata
import re
import html
import sys
import os
import urllib.request
from datetime import datetime

def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)

def extract_date_and_slug(title, item_node):
    """
    Extrai a data real no formato AAAA-MM-DD e o slug limpo do título.
    """
    # Tenta encontrar o padrão de data DD/MM/AAAA no início do título
    date_match = re.match(r'^(\d{2})/(\d{2})/(\d{4})', title.strip())
    
    if date_match:
        day, month, year = date_match.groups()
        real_date = f"{year}-{month}-{day}"
        title_remaining = re.sub(r'^\d{2}/\d{2}/\d{4}\s*[-–—:]*\s*', '', title)
    else:
        # Alternativa: Tenta buscar a data da tag <pubDate> se disponível
        pub_date_node = item_node.find('pubDate')
        if pub_date_node is not None and pub_date_node.text:
            try:
                # Exemplo: Mon, 20 Jul 2026 11:50:42 GMT
                parsed_date = datetime.strptime(pub_date_node.text[:25].strip(), "%a, %d %b %Y %H:%M:%S")
                real_date = parsed_date.strftime("%Y-%m-%d")
            except Exception:
                real_date = "2026-07-20"
        else:
            real_date = "2026-07-20"
        title_remaining = title

    title_clean = slugify(title_remaining)
    
    # Retorna a data estruturada e o nome do arquivo mdx
    if title_clean:
        filename = f"{real_date}-{title_clean}.mdx"
    else:
        filename = f"{real_date}.mdx"
        
    return real_date, filename

def clean_html_to_markdown(html_content):
    if not html_content:
        return ""
    
    html_content = re.sub(r'<div class="captioned-image-container">.*?</div>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<figure>.*?</figure>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<img [^>]*>', '', html_content)
    html_content = re.sub(r'<blockquote>(.*?)</blockquote>', r'> \1\n\n', html_content, flags=re.DOTALL)
    
    paragraphs = re.findall(r'<p>(.*?)</p>', html_content, flags=re.DOTALL)
    
    md_lines = []
    for p in paragraphs:
        p_clean = re.sub(r'<[^>]+>', '', p).strip()
        if p_clean:
            md_lines.append(p_clean)
            
    if not md_lines:
        text_clean = re.sub(r'<[^>]+>', '', html_content)
        md_lines = [line.strip() for line in text_clean.split('\n') if line.strip()]
        
    return "\n\n".join(md_lines)

def convert_feed_to_mdx(feed_source, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Pasta de saída criada: {output_dir}")

    print(f"Lendo o feed de: {feed_source}")
    
    try:
        if feed_source.startswith(('http://', 'https://')):
            req = urllib.request.Request(feed_source, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                xml_data = response.read()
            root = ET.fromstring(xml_data)
        else:
            tree = ET.parse(feed_source)
            root = tree.getroot()
    except Exception as e:
        print(f"Erro ao carregar ou processar o feed: {e}")
        return
    
    namespaces = {
        'dc': 'http://purl.org/dc/elements/1.1/',
        'content': 'http://purl.org/rss/1.0/modules/content/'
    }
    
    items = root.findall('.//item')
    print(f"Encontrados {len(items)} artigos no feed.\n")
    
    for item in items:
        title_raw = item.find('title').text if item.find('title') is not None else 'Sem Titulo'
        author_raw = item.find('dc:creator', namespaces).text if item.find('dc:creator', namespaces) is not None else 'Autor Desconhecido'
        description_raw = item.find('description').text if item.find('description') is not None else ''
        content_raw = item.find('content:encoded', namespaces)
        html_content_raw = content_raw.text if content_raw is not None else ''
        
        title = html.unescape(title_raw)
        author = html.unescape(author_raw)
        description = html.unescape(description_raw)
        html_content = html.unescape(html_content_raw)
        
        description = re.sub(r'["“”]', "'", description)
        
        # CORREÇÃO: Extrai dinamicamente a data correta para cada artigo específico
        date, filename = extract_date_and_slug(title, item)
        
        markdown_text = clean_html_to_markdown(html_content)
        
        mdx_content = f'''---
title: "{title}"
author: "{author}"
description: "{description}"
date: "{date}"
---

{markdown_text}
'''
        
        file_path = os.path.join(output_dir, filename)
        
        with open(file_path, 'w', encoding='utf-8') as mdx_file:
            mdx_file.write(mdx_content)
        
        print(f"Gerado: {file_path}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Uso correto: python script.py <URL_OU_CAMINHO_DO_XML> <PASTA_DE_SAIDA>")
        sys.exit(1)
        
    source = sys.argv[1]
    output = sys.argv[2]
    
    convert_feed_to_mdx(source, output)