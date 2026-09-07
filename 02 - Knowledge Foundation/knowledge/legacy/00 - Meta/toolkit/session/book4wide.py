import glob

f = sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\finished drafts\Book 4 - Fall*.md'))[0]
t = open(f, encoding='utf-8', errors='replace').read()
i = t.find('never once asked')
out = ['WIDE CTX: ' + t[i - 400:i + 400].replace(chr(10), ' ')]
open(r'C:\Users\Admin\AppData\Local\Temp\opencode\book4wide.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('wrote wide')
