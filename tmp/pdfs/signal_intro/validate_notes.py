from pathlib import Path
import csv,json,re,hashlib
import numpy as np
from PIL import Image
from build_notes import OUT,TOPICS

all_pages=[];refs=[]
for num,a,b,name,title in TOPICS[:10]:
    p=OUT/name; t=p.read_text(encoding='utf-8')
    expected=list(range(a,b+1)); actual=[int(x) for x in re.findall(r'^### PDF page (\d+) -',t,re.M)]
    assert actual==expected,(name,actual)
    all_pages+=actual
    for required in ['## Cue Column','## Notes Section','## Lyons supplement','## Worked example','## Retrieval practice and answer key','## Summary Section']:
        assert required in t,(name,required)
    assert '[Insert' not in t and 'TODO' not in t
    assert t.count('$$')%2==0 and t.count('```')%2==0
    for page in expected:assert t.count(f'./images/lecture/lecture-p{page:03}.png')==1
    without_math=re.sub(r'\$\$[\s\S]*?\$\$|\$[^$\n]+\$','',t)
    for target in re.findall(r'\]\(([^)]+)\)',without_math):
        path=target.split('#')[0]
        if path and not re.match(r'https?://',path):assert (OUT/path).resolve().exists(),(name,path)
        refs.append(target)
    for line in t.splitlines():
        if line.startswith('|'):
            for m in re.findall(r'\$([^$]+)\$',line): assert '|' not in m,(name,line)
assert all_pages==list(range(1,204))
rows=list(csv.DictReader((OUT/'coverage.csv').open(encoding='utf-8')))
assert [int(r['lecture_pdf_page']) for r in rows]==list(range(1,409))
assert sum(r['status']=='created' for r in rows)==203
assert len(list(OUT.glob('[0-9][0-9]_*.md')))==10
manifest=json.loads((OUT/'images/manifest.json').read_text())
assert len(manifest['images'])==214
for row in manifest['images']:
    f=OUT/row['file'];assert hashlib.sha256(f.read_bytes()).hexdigest()==row['sha256']
    with Image.open(f) as im:im.verify()
    assert row['file'] in '\n'.join((OUT/t[3]).read_text(encoding='utf-8') for t in TOPICS[:10])

# Independently compare closed forms with sample-by-sample recurrence.
ys={-2:-1.,-1:1.}; zi={-2:-1.,-1:1.};zs={-2:0.,-1:0.};h={-2:0.,-1:0.}
for n in range(10):
    ys[n]=8-ys[n-1]+6*ys[n-2]
    zi[n]=-zi[n-1]+6*zi[n-2]
    zs[n]=8-zs[n-1]+6*zs[n-2]
    h[n]=(1 if n==0 else 0)-h[n-1]+6*h[n-2]
    np.testing.assert_allclose(ys[n],-1.8*(-3)**n+4.8*2**n-2)
    np.testing.assert_allclose(ys[n],zi[n]+zs[n])
    np.testing.assert_allclose(h[n],.6*(-3)**n+.4*2**n)
for z in [1.7+.8j,3.,-.8+2j]:
    q=1/z
    np.testing.assert_allclose((1+q)**2/((1-.5*q)*(1-q)),2-9/(1-.5*q)+8/(1-q))
    np.testing.assert_allclose((1-.5*q)*(1+.75*q),1+.25*q-.375*q*q)
    np.testing.assert_allclose((1+q)**2/(1-.75*q+.125*q*q),8+18/(1-.5*q)-25/(1-.25*q))
    np.testing.assert_allclose(z*z*(1-.5*q)*(1-q*q),z*z-.5*z-1+.5*q)

# Recover lattice coefficients, then reconstruct the original polynomial and ladder numerator.
a3=np.array([.9,-.64,.576]);k3=a3[-1]
a2=(a3[:2]+k3*a3[:2][::-1])/(1-k3*k3);k2=a2[-1];k1=a2[0]/(1-k2)
prev=np.array([k1]);up2=np.r_[prev-k2*prev[::-1],k2];up3=np.r_[up2-k3*up2[::-1],k3]
np.testing.assert_allclose(up3,a3)
c3=1.;c2=3+c3*a3[0];c1=3+c2*a2[0]+c3*a3[1];c0=1+c1*k1+c2*k2+c3*k3
np.testing.assert_allclose([c2,c1,c0],[3.9,5.4612,4.5404],atol=5e-5)
polys=[np.array([1.]),np.array([1.,-k1]),np.r_[1.,-a2],np.r_[1.,-a3]]
b=np.zeros(4)
for c,poly in zip([c0,c1,c2,c3],polys):b[:len(poly)]+=c*poly[::-1]
np.testing.assert_allclose(b,[1,3,3,1])

# DFT inversion, energy, convolution, correlation, shift, and folded FIR.
x=np.array([1,0,-1,0]);X=np.fft.fft(x)
np.testing.assert_allclose(X,[0,2,0,2],atol=1e-12)
np.testing.assert_allclose(np.fft.ifft(X),x,atol=1e-12)
np.testing.assert_allclose(np.vdot(x,x),np.vdot(X,X)/4)
x=np.array([1,2,3]);h=np.ones(3);lin=np.convolve(x,h)
np.testing.assert_allclose(lin,[1,3,6,5,3])
np.testing.assert_allclose(np.fft.ifft(np.fft.fft(x,4)*np.fft.fft(h,4)),[4,3,6,5],atol=1e-12)
np.testing.assert_allclose(np.fft.ifft(np.fft.fft(x,8)*np.fft.fft(h,8)),np.r_[lin,[0,0,0]],atol=1e-12)
rng=np.random.default_rng(10);x=rng.normal(size=8)+1j*rng.normal(size=8);y=rng.normal(size=8)+1j*rng.normal(size=8)
corr=np.array([sum(x[n]*y[(n-l)%8].conjugate() for n in range(8)) for l in range(8)])
np.testing.assert_allclose(np.fft.fft(corr),np.fft.fft(x)*np.fft.fft(y).conjugate(),atol=1e-11)
np.testing.assert_allclose(np.fft.fft(np.roll(x,3)),np.fft.fft(x)*np.exp(-2j*np.pi*np.arange(8)*3/8),atol=1e-11)
print(json.dumps({'topic_files':10,'lecture_pages_created':203,'lecture_pages_planned_total':408,'topics_planned':21,'verified_images':214,'markdown_link_instances':len(refs),'numerical_checks':'PASS: recurrences, transform expansions, lattice/ladders, DFT, correlation, convolution'},indent=2))
