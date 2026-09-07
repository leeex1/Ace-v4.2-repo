import glob

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
log = []

# CJK reconstructions (corruption predates both trees; context-derived)
recon = [
    ('will\u6269\u5927under', 'will buckle under'),       # buckle under pressure (idiom)
    ('scanning\u6389\u51b2and', 'scanning array and'),    # scanning array (SF term)
    ('the\u8cab\u5fbdof old wounds', 'the marks of old wounds'),
    ('what\u5979had been born', 'what station she had been born'),  # citizenship theme
    ('merely\u58ee\u89c2\u201a ', 'merely '),              # drop CJK + stray quote, keep em-dash
]
for old, new in recon:
    c = t.count(old)
    t = t.replace(old, new)
    log.append(f'{old[:12]}... x{c} -> {new[:40]}')

# plain typos
for old, new in [('offorge-fire', 'of forge-fire'), ('memorys', 'memories'),
                 ('Gatitude', 'Gratitude')]:
    c = t.count(old)
    t = t.replace(old, new)
    log.append(f'{old} x{c} -> {new}')

open(f, 'w', encoding='utf-8', newline='').write(t)

# verify
t2 = open(f, encoding='utf-8').read()
import re
log.append('residual CJK: ' + str(len(re.findall(r'[\u4e00-\u9fff]', t2))))
log.append('residual memorys: ' + str(t2.count('memorys')))
print('\n'.join(log))
