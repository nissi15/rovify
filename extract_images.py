import urllib.request, re
import html as html_module
try:
    req = urllib.request.Request('https://rovify.io', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = set()
    matches.update(re.findall(r'src=["\'](https?://[^\s"\'>]+(?:png|jpg|jpeg|webp|svg|gif)[^\s"\'>]*)["\']', html))
    for m in matches:
        print(m)
except Exception as e:
    print(e)
