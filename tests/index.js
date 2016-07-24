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


let diff;

diff = iqwerty.diff.Diff('pineapple', 'apple');
Test('"pineapple" to "apple" should have Levenshtein distance of 4')
	.expect(diff.levenshteinDistance)
	.toBe(4);

Test('"pineapple" to "apple" should have an array of 9 changes')
	.expect(diff.changes.length)
	.toBe(9);

Test('"pineapple" to "apple" should output a diff string of "(-p)(-i)(-n)(-e)apple"')
	.expect(diff.toString())
	.toBe('(-pine)apple');


diff = iqwerty.diff.Diff('apple', 'pineapple');
Test('"apple" to "pineapple" should have a Levenshtein distance of 4')
	.expect(diff.levenshteinDistance)
	.toBe(4);

Test('"apple" to "pineapple" should output a diff string of "(+p)(+i)(+n)(+e)apple"')
	.expect(diff.toString())
	.toBe('(+pine)apple');


diff = iqwerty.diff.Diff('kitten', 'sitting');
Test('"kitten" to "sitting" should have a Levenshtein distance of 3')
	.expect(diff.levenshteinDistance)
	.toBe(3);

Test('"kitten" to "sitting" should have an array of 7 changes')
	.expect(diff.changes.length)
	.toBe(7);

Test('"kitten" to "sitting" should output a diff string of "(-k)(+s)itt(-e)(+i)n(+g)"')
	.expect(diff.toString())
	.toBe('(-k)(+s)itt(-e)(+i)n(+g)');


diff = iqwerty.diff.Diff('', '.');
Test('Edge case from empty to symbol should output a diff string of "(+.)"')
	.expect(diff.toString())
	.toBe('(+.)');


diff = iqwerty.diff.Diff('.', '');
Test('Edge case from symbol to empty should output a diff string of "(-.)"')
	.expect(diff.toString())
	.toBe('(-.)');