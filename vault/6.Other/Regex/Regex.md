Regular Expressions, abbreviated as Regex or Regexp, are a string of characters created within the framework of Regex syntax rules. You can easily manage your data with Regex, which uses commands like finding, matching, and editing.

```
^\w+\.pdf$
```

`^` mean start of string, `\w` mean one or more words, `+` indicate once or more and `\.` indicate `.` and `$` indicate end of string.

The period `.` allows selecting any character, including special characters and spaces.

`bar` `ber` `bir` `bor` `bur`
if you want to exclude `ber` and `bor` use this regex `b[^eo]r`. 

`bear` `beor` `beer` `beur` if you want to exclude `o` and `u` use this `be[^ou]r`. 

Asterisk `*` after a character to indicate that the character may either not match at all or can match many times.

A character can occur one or more times, we put a plus sign `+` after a character.
`be+r` here `e` is imp `br` `ber` `beer` 

To indicate that a character is optional, we put a `?` question mark after a character.
`colou?r` here `u` optional.

To express a certain number of occurrences of a character, at the end we write curly braces `{n}` along with how many times we want it to occur.
`ber` `beer` `beeer` `beeeer`  here `e` occur only two times `be{2}r`.

To express at least a certain number of occurrences of a character, immediately after the character we write at least how many times we want it to occur in a row followed by a comma , and wrapped inside curly braces `{n, }`.
`ber` `beer` `beeer` `beeeer`  here use use `be{3,}r`

To express the occurrence of a character in a certain number range, we write curly braces `{x,y}` for the inclusive interval.
Here `e` will occur once or three times. `be{1,3}r`

We can group an expression and use these groups to reference or enforce some rules. To group an expression, we enclose `()` in parentheses.
`ha-ha`,`haa-haa` for just group we use `(haa)`

Below, we have two groups: `(ha) `and `(haa)`. When we want to reference these groups later in the pattern, we use `\1` for the first group and `\2` for the second group. For example, in the pattern `(ha)-\1,(haa)-\2`, the - is outside the groups, and `\1` refers to ha while `\2` refers to `haa`.
`ha-ha,haa-haa` here match using this `(ha)-\1,(haa)-\2`

Pipe allows to specify that an expression can be in different expressions.. This differs from charset `[abc]`, charsets operate at the character level. Alternatives are at the expression level
`cat` `rat` `dog` here is `(c|r)at|dog`

We were using `[0-9]` to find numbers. To find only numbers at the beginning of a line, prefix this expression with the `^` sign.
```
1. 3 eggs, beaten  
2. 1 tsp sunflower oil  
3. 1 tsp butter
```
this regex match line number `^[0-9]`

`$` indicate that text should end with this.
like `.pdf$`

The expression `\w` is used to find letters, numbers and underscore characters.
`abcABC123 _.:!?` to match except `abcABC123` use this `[^a-zA-Z0-9_]`.

`\d` use only to find numbers and `\D` use to find numeric characters and `\s` use for space and `\S` for non space characters.

To select only hour value `Date: 4 Aug 3PM` use this regex `\d+(?=PM)` and if only date use this `\d+(?!PM)`.



