import glob
import re

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
out = []
for m in re.finditer(r'[\u4e00-\u9fff\u00c0-\u00ff]{1,4} ?—?|[\u4e00-\u9fff]{1,3}', t):
    s, e = m.start(), m.end()
    out.append(f'POS {s}: LEFT=[{t[s-25:s]}] HIT=[{m.group(0)}] RIGHT=[{t[e:e+25]}]')
    out.append('  HEX: ' + ' '.join(hex(ord(c)) for c in m.group(0)))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4dump.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('dumped', len(out) // 2, 'sites')
