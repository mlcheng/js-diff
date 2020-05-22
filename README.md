# js-diff

Easily find the difference between two strings using [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

A demo is available on my [playground](https://playground.michaelcheng.us/lib-js/diff/).

## Usage
To find the diff between two strings, specify the source and the final string to find the transformation.

```javascript
const source = 'pineapple';
const destination = 'apple';

iqwerty.diff.diff(source, destination);
```

A `DiffObject` is returned. It contains the following properties:

### `.from`
The source string - in this case: 'pineapple'.

### `.to`
The destination string - in this case: 'apple'.

### `.levenshteinDistance`
The edit distance, or the amount of changes needed to transform the source to destination string.

### `.changes`
An array containing the changes needed to transform the source string. You may parse this yourself if you wish.

### `.toString()`
Call this method to print the default string with changes made. In this case, `.toString()` will output an object:

```js
{
	plainText: '(-pine)apple',
	richText: '<span class="iqwerty-diff-remove">(-pine)</span>apple',
}
```

The `iqwerty-diff-remove` and `iqwerty-diff-add` classes can be styled however you like.