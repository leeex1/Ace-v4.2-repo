d = open(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 5 - The Howling Shadow.md', encoding='utf-8', errors='replace').read()
r = open(r'C:\02_QUILLAN\Book Series\Book 5 - Shadows That Speak.md', encoding='utf-8', errors='replace').read()
out = []
for anchor in ['The same voice that had said', 'the same clinical']:
    for label, t in [('DRAFT', d), ('ROOT', r)]:
        i = t.find(anchor)
        seg = t[i:i + 120] if i >= 0 else 'NOT FOUND'
        out.append(f'[{anchor[:20]}][{label}] ' + ' '.join(f'U+{ord(c):04X}' for c in seg[:60]))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book5ctx.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('dumped')
