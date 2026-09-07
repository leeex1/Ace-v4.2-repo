import glob

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
log = []

def rep(old, new):
    global t
    c = t.count(old)
    t = t.replace(old, new)
    log.append(f'x{c}: {new[:50]}')

# CJK/mojibake reconstructions (exact codepoints from dump)
rep('will\u6269\u5927under', 'will buckle under')
rep('scanning\u8109\u51b2and', 'scanning array and')
rep('the\u8bb0\u5fc6of old wounds', 'the marks of old wounds')
rep('asked what\u5979had been born', 'asked what station she had been born')
rep('not merely\u00e5\u00a3\u00ae\u00e8\u00a7\u201a, - it was',
    'not merely \u2014 it was')

# plain typos
rep('offorge-fire', 'of forge-fire')
rep('memorys', 'memories')
rep('Gatitude', 'Gratitude')
rep('Fenric of the bear-kin', 'Fenris of the bear-kin')

open(f, 'w', encoding='utf-8', newline='').write(t)

import re
t2 = open(f, encoding='utf-8').read()
log.append('residual CJK: ' + str(len(re.findall(r'[\u4e00-\u9fff]', t2))))
log.append('residual latin-mojibake: ' + str(t2.count('\u00e5\u00a3\u00ae')))
log.append('Fenric left: ' + str(t2.count('Fenric')))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4fix2log.txt', 'w', encoding='utf-8').write('\n'.join(log))
print('done')
