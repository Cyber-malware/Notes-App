


```
$path = $request->getPathInfo();
$path = rawurldecode($request->getPathInfo());
 if (substr($path, 0, 3) == '../' || substr($path, -3) == '/..' || strpos($path, '/../') ||
     substr($path, 0, 3) == '..\\' || substr($path, -3) == '\\..' || strpos($path, '\\..\\')) {

```
while that is one way to go. you forgot about "../\", " ..\/", "/.." & "\/.." this works because some oses (unix like) parse the backslash to forward slash and proceed. add those and I think you should be fine. :)