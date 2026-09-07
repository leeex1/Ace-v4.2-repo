import glob, re
from ebooklib import epub
for f in sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\epubs\*.epub')):
    b = epub.read_epub(f)
    docs = [i for i in b.get_items() if i.get_type() == 9]
    w = sum(len(re.sub(r'<[^>]+>', ' ', d.get_content().decode('utf-8', 'replace')).split()) for d in docs)
    name = f.split('\\')[-1]
    print(f"{name}: {len(docs)} docs, {w} words, spine={len(b.spine)}")
