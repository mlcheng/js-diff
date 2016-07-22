/***********************************************

  "index.js"

  Created by Michael Cheng on 07/22/2016 12:48
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, __dirname, iqwerty */
const { Test, inject } = require('../../test/test.js');
inject(__dirname, '../diff.js');


let res;

res = iqwerty.diff.Diff('pineapple', 'apple');
Test('"pineapple" to "apple" should have Levenshtein distance of 4')
	.expect(res.levenshteinDistance)
	.toBe(4);

Test('"pineapple" to "apple" should have an array of 9 changes')
	.expect(res.changes.length)
	.toBe(9);

Test('"pineapple" to "apple" should output a diff string of "(-p)(-i)(-n)(-e)apple"')
	.expect(res.toString())
	.toBe('(-p)(-i)(-n)(-e)apple');


res = iqwerty.diff.Diff('apple', 'pineapple');
Test('"apple" to "pineapple" should have a Levenshtein distance of 4')
	.expect(res.levenshteinDistance)
	.toBe(4);

Test('"apple" to "pineapple" should output a diff string of "(+p)(+i)(+n)(+e)apple"')
	.expect(res.toString())
	.toBe('(+p)(+i)(+n)(+e)apple');


res = iqwerty.diff.Diff('kitten', 'sitting');
Test('"kitten" to "sitting" should have a Levenshtein distance of 3')
	.expect(res.levenshteinDistance)
	.toBe(3);

Test('"kitten" to "sitting" should have an array of 7 changes')
	.expect(res.changes.length)
	.toBe(7);

Test('"kitten" to "sitting" should output a diff string of "(-k)(+s)itt(-e)(+i)n(+g)"')
	.expect(res.toString())
	.toBe('(-k)(+s)itt(-e)(+i)n(+g)');