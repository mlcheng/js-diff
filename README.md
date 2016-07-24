# js-diff

Easily find the difference between two strings using [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

A demo is available on my [playground](https://www.michaelcheng.us/playground/lib-js/diff/).

## Usage
To find the diff between two strings, specify the source and the final string to find the transformation.

```javascript
let source = 'pineapple';
let destination = 'apple';

iqwerty.diff.Diff(source, destination);
```

A `DiffObject` is returned. It contains the following properties:

### `from`
The source string - in this case: 'pineapple'.

### `to`
The destination string - in this case: 'apple'.

### `levenshteinDistance`
The edit distance, or the amount of changes needed to transform the source to destination string.

### `changes`
An array containing the changes needed to transform the source string. You may parse this yourself if you wish.

### `toString()`
Call this method to print the default string with changes made. In this case, `.toString()` will output

```html
(-pine)apple"
```
