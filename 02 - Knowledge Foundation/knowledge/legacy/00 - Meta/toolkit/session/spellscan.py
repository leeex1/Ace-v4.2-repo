import glob
import re
from collections import Counter

from spellchecker import SpellChecker

sp = SpellChecker()
fantasy = set(
    'zaphrum shring windstepped yrridian vaelthorne starbloom discorporating '
    'lukas gothryn elena thornweave marlo fenris shadowfang warrens chimera '
    'yrridia spire elves hybrid throne shoggoth ronin oni quillan'.split()
)
sp.word_frequency.load_words(fantasy)

for b in range(1, 6):
    files = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book %d*.md' % b))
    f = files[0]
    t = open(f, encoding='utf-8', errors='replace').read()
    words = re.findall(r"[A-Za-z']+", t.lower())
    unknown = sp.unknown(words)
    c = Counter(w for w in words if w in unknown)
    print(f'--- Book {b}: {len(unknown)} distinct unknowns, top suspects:')
    for w, n in c.most_common(15):
        print(f'   {w} x{n}')
