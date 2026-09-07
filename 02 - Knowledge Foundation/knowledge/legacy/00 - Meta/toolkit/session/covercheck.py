"""Pixel-assert print-cover layout on 50dpi raster previews."""
import glob

import pymupdf
from PIL import Image

for f in sorted(glob.glob(r'C:\02_QUILLAN\02_Projects\Book Series\print\Book *cover*.pdf')):
    d = pymupdf.open(f)
    px = d[0].get_pixmap(dpi=50)
    im = Image.frombytes('RGB', (px.width, px.height), px.samples).convert('L')
    W, H = im.size
    name = f.split('\\')[-1][:28]
    # zones (fractions of full width 13.671in for book1 scale; use relative)
    back = im.crop((0, 0, int(W * 0.44), H))
    spine = im.crop((int(W * 0.44), 0, int(W * 0.56), H))
    front = im.crop((int(W * 0.56), 0, W, H))
    pxb = list(back.getdata())
    light_back = sum(1 for p in pxb if p > 150) / len(pxb)
    # barcode: white box expected lower-right of back zone
    bw = back.crop((back.width - 120, back.height - 110, back.width - 10, back.height - 10))
    white_box = sum(1 for p in bw.getdata() if p > 230) / (110 * 100)
    # front art variance (should be an image, not flat)
    import statistics
    samp = list(front.getdata())[::97]
    var = statistics.pvariance(samp)
    # spine strip present (darker band between back and front)
    print(f'{name}: back-text-light={light_back:.3f} barcode-white={white_box:.2f} front-var={var:.0f}')
