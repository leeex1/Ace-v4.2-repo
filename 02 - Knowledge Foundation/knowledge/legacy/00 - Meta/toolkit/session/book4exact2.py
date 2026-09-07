import glob

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
out = []
for anchor in ['was not merely', "system's scanning", 'notched with the']:
    i = t.find(anchor)
    seg = t[i:i + 70]
    out.append(f'[{anchor}] -> ' + ' '.join(f'U+{ord(c):04X}' for c in seg[:40]))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4exact2.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('dumped')
