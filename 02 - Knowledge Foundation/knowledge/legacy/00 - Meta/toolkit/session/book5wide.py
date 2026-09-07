d = open(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 5 - The Howling Shadow.md', encoding='utf-8', errors='replace').read()
out = []
i = d.find('The same voice that had said')
out.append('SITE1: ' + d[i - 350:i + 120].replace(chr(10), ' '))
j = d.find('the same heat from below')
out.append('SITE2: ' + d[j - 100:j + 400].replace(chr(10), ' '))
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book5wide.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('dumped')
