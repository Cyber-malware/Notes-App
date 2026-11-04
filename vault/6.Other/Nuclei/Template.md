Nuclei built in `GO` and its template written in `yaml`. 

```
Template ID
Template info
Request
Response
```

`ID` can be anything like `CVE` name.
`info` contain `name`, `author`, `tags` and `severity` etc
`Request` deprecated now `https` used contain `method`, `path`

`Request` will be get or post etc, path will be `baseurl` were request will send like `.htpasswd` then `matchers-condition` `and/or` then `type` will be `word` and then `words` will be  hashes. 

condition `or`, `type` status and then `status` is like 200.



```sh
id: htpasswd

info:
  name: Detect exposed .htpasswd files
  author: geeknik
  severity: info
  tags: config,exposure

requests:
  - method: GET
    path:
      - "{{BaseURL}}/.htpasswd"

    matchers-condition: and
    matchers:
      - type: word
        words:
          - ":{SHA}"
          - ":$apr1$"
          - ":$2y$"
        condition: or

      - type: status
        status:
          - 200
```