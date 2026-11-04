
### WayBack
```bash
curl -G "https://web.archive.org/cdx/search/cdx" \
  --data-urlencode "url=*.amrelsagaei.com/*" \
  --data-urlencode "output=text" \
  --data-urlencode "fl=original" | grep '\.js$' > js-cdx.txt
```

```
cat js.txt | httpx -mc 200 -o js.live.txt

cat js_live.txt | grep '/.js$' > js-filter.txt
```

We can use `linkfiner` or any other tool like `jsleak` etc
```bash
go install github.com/0xTeles/jsleak/v2/jsleak@latest

##run it 
cat live-js.txt | jsleaks -s -l -k
```

### Nuclei
If site have `firewall` so we cant use `nuclei` so we can download all `js` files.
```bash
nuclei -l js.txt -t ~/nuclei-templates/exposures/ -o js_bugs.txt
```