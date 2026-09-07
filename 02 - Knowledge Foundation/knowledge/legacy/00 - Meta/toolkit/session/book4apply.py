import glob

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
log = []

# locate the corrupt merely site exactly
i = t.find('The sight was not merely')
seg = t[i:i + 80]
log.append('merely-site: ' + ' '.join(f'U+{ord(c):04X}' for c in seg[24:52]))

fixes = [
    ('will\u6269\u5927 under', 'will buckle under'),
    ('scanning\u8109\u51b2 and', 'scanning array and'),
    ('the\u8bb0\u5fc6 of old wounds', 'the marks of old wounds'),
    ('asked what\u5979 had been born', 'asked what station she had been born'),
]
# merely site handled after exact slice known
for old, new in fixes:
    c = t.count(old)
    t = t.replace(old, new)
    log.append(f'x{c}: {new[:45]}')

open(f, 'w', encoding='utf-8', newline='').write(t)
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4applylog.txt', 'w', encoding='utf-8').write('\n'.join(log))
print('applied')
