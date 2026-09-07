import glob
import re

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
cjk = [(m.start(), t[m.start() - 30:m.start() + 30]) for m in re.finditer(r'[\u4e00-\u9fff]', t)]
out = [f'CJK hits: {len(cjk)}']
for pos, ctx in cjk:
    out.append('...' + ctx.replace(chr(10), ' ') + '...')
    out.append('   codepoints: ' + ' '.join(hex(ord(c)) for c in t[pos - 2:pos + 6]))
i = t.find('Fenric')
out.append('Fenric ctx: ' + t[i - 100:i + 150].replace(chr(10), ' '))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4ctx.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('wrote ctx')
