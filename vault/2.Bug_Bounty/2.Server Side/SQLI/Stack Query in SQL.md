Stacked queries SQL injection is a form of [SQL injection](https://www.aptive.co.uk/blog/what-is-sql-injection/) that allows an attacker to execute multiple SQL statements in a single query. This technique leverages the ability of some database management systems (DBMS) to handle multiple queries in one request, separated by semicolons or other delimiters. The first query may be legitimate, while the second or subsequent queries are injected by the attacker. [Website](https://acorzo1983.github.io/SQLMapCG/	).

```sql
' OR 1=1; DROP TABLE users; --
```
the first query `' OR 1=1` could bypass authentication or input validation, and the second query `DROP TABLE users` would be executed to delete the `users` table.

Stacked queries SQL injection typically occurs when an application fails to properly validate user input before including it in an SQL query.
```sql
SELECT * FROM users WHERE username = 'user_input' AND password = 'user_input';
```

The semicolon (`;`) allows the attacker to append a second query, which could be any valid SQL, such as a `DROP`, `UPDATE`, or `INSERT` command. such as
```sql
1; DROP TABLE products; --
```
so final query will be
```sql
SELECT * FROM products WHERE product_id = '1'; DROP TABLE products; --';
```

**Risks of Stacked Queries (SQL Injection):**
- Data loss or tampering (e.g., DROP, UPDATE, INSERT).
- Authentication bypass.
- Privilege escalation.
- Data theft (e.g., credentials, personal info).
- Leads to breaches, financial loss, and reputational damage.

**Identifying Stacked Queries (SQLi):**
- Check for unvalidated user input in SQL queries.
- Test if semicolons (;) are accepted in input.
- Perform manual testing: input with ; and multiple queries.
- Use automated tools (e.g., SQLMap).
- Watch for database error messages (e.g., syntax errors).

