import glob
import re

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 5 - The Howling*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
log = []

# warmthes contexts first (verify-only)
for m in re.finditer(r'.{60}warmthes.{60}', t):
    log.append('WARMTHES: ...' + m.group(0).replace(chr(10), ' ') + '...')

# 1. voice echo: 'had said "Up" to him' (the voice literally said "Up." one line prior)
old1 = 'said\u00e6\u2030\u201c\u00e5\u0152\u2026 him'
log.append(f'site1 x{t.count(old1)}')
t = t.replace(old1, 'said "Up" to him')

# 2. 'the same clinical precision of' (matches Book 3 diction)
old2 = 'clinical\u00e6\u00b8\u00a9\u00e5\u00ba\u00a6 of'
log.append(f'site2 x{t.count(old2)}')
t = t.replace(old2, 'clinical precision of')

# 3. warmthes -> warmths
n3 = t.count('warmthes')
t = t.replace('warmthes', 'warmths')
log.append(f'warmthes x{n3} -> warmths')

open(f, 'w', encoding='utf-8', newline='').write(t)
t2 = open(f, encoding='utf-8').read()
log.append('residual site1: ' + str(t2.count('said\u00e6')))
log.append('residual site2: ' + str(t2.count('clinical\u00e6')))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book5fixlog.txt', 'w', encoding='utf-8').write('\n'.join(log))
print('applied')
