During the assessment, we discovered one of the endpoints leaking `PatientID`. However, to bypass authentication, `AuthKey` was required. This is where we utilized the `$exists` operator with a value of “true”, which forces the application to evaluate the existence of the `AuthKey` field. In other words, it makes the statement true, hence bypassing authentication.

**POC Authentication**
```
www.vulnerableapp.com/api/v1/patients/getMedicalHistory?PatientID=11232241&AuthKey[$exists]=true
```

There are other operators, such as $gt and $ne, which can be used to query to return specific records from databases.

**POC to Retrieve Doctor Details**
The $gt operator here will retrieve records where the AuthToken value is greater than 0. In most cases, this would include records with positive numeric AuthToken values.
```
https://vulnerableapp.com/api/v1/doctor/getProfile?DoctorID=18141842&AuthKey[$gt]=0&UserType=doctor
```

**POC to Retrieve Patient Details**
The $ne operator here will retrieve records where “Auth_Key” is not equal to “0”; it will exclude records with an Auth_Key of 0, likely indicating invalid or inactive accounts.
```
https://vulnerableapp.com/api/v1/patients/getProfile?PatientID=123123213&AuthKey[$ne]=0
```

**Tip**: While the test cases previously described were for Boolean-based injection, whereby you can manipulate queries to return true or false conditions, it’s also important to test for other types of MongoDB injection vulnerabilities. To test for potential MongoDB injection, try using special characters like single quotes (‘), double quotes (“), semi-colons (;), backs-
lashes (\), parentheses (), brackets [], and braces {} in the input fields.

