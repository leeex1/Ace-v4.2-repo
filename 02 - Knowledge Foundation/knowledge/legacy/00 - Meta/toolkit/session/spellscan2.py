import glob
import re
from collections import Counter

from spellchecker import SpellChecker

sp = SpellChecker()

for b in range(1, 6):
    files = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book %d*.md' % b))
    f = files[0]
    t = open(f, encoding='utf-8', errors='replace').read()
    words = re.findall(r"[A-Za-z']+", t.lower())
    unknown = sp.unknown(words)
    c = Counter(w for w in words if w in unknown)
    # low-frequency unknowns only: names repeat, typos don't
    rare = sorted([w for w, n in c.items() if n <= 2 and len(w) > 3 and "'" not in w])
    print(f'--- Book {b}: {len(rare)} rare unknowns ---')
    print('   ' + ', '.join(rare[:60]))
