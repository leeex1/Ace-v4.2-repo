import glob
import re

checks = [
    (2, ['didn', 'hadn', 'tthe', 'sympathic', 'gallow', 'unshed', 'unwrote']),
    (3, ['depency', 'discent', 'emptive', 'ffighting', 'reclaimining']),
    (1, ['gutteral']),
]
for b, words in checks:
    f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book %d*.md' % b))[0]
    t = open(f, encoding='utf-8', errors='replace').read()
    for w in words:
        ms = list(re.finditer(r'.{60}' + w + r'.{60}', t, flags=re.IGNORECASE))[:2]
        for m in ms:
            print(f'B{b} [{w}]: ...{m.group(0).replace(chr(10), " ")}...')
        if not ms:
            print(f'B{b} [{w}]: NOT FOUND')
