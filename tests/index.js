/***********************************************

  "index.js"

  Created by Michael Cheng on 07/22/2016 12:48
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, __dirname, iqwerty */
const { Test, inject } = require('../../janus/janus.js');
inject(__dirname, '../diff.js');


const pineappleDiff = iqwerty.diff.Diff('pineapple', 'apple');
const appleDiff = iqwerty.diff.Diff('apple', 'pineapple');
const kittyDiff = iqwerty.diff.Diff('kitten', 'sitting');

Test('"pineapple" to "apple" should have a Levenshtein distance of 4', ({ expect }) => {
	expect(pineappleDiff.levenshteinDistance).toBe(4);
});

Test('"pineapple" to "apple" should have an array of 9 changes', ({ expect }) => {
	expect(pineappleDiff.changes.length).toBe(9);
});

Test('"pineapple" to "apple" should output a diff string of "(-pine)apple"', ({ expect }) => {
	expect(pineappleDiff.toString().plainText).toBe('(-pine)apple');
});

Test('"apple" to "pineapple" should have a Levenshtein distance of 4', ({ expect }) => {
	expect(appleDiff.levenshteinDistance).toBe(4);
});

Test('"apple" to "pineapple" should output a diff string of "(+pine)apple"', ({ expect }) => {
	expect(appleDiff.toString().plainText).toBe('(+pine)apple');
});

Test('"kitten" to "sitting" should have a Levenshtein distance of 3', ({ expect }) => {
	expect(kittyDiff.levenshteinDistance).toBe(3);
});

Test('"kitten" to "sitting" should have an array of 7 changes', ({ expect }) => {
	expect(kittyDiff.changes.length).toBe(7);
});

Test('"kitten" to "sitting" should output a diff string of "(-k)(+s)itt(-e)(+i)n(+g)"', ({ expect }) => {
	expect(kittyDiff.toString().plainText).toBe('(-k)(+s)itt(-e)(+i)n(+g)');
});

Test('Edge case from empty to symbol should output a diff string of "(+.)"', ({ expect }) => {
	const diff = iqwerty.diff.Diff('', '.');
	expect(diff.toString().plainText).toBe('(+.)');
});

Test('Edge case from symbol to empty should output a diff string of "(-.)"', ({ expect }) => {
	const diff = iqwerty.diff.Diff('.', '');
	expect(diff.toString().plainText).toBe('(-.)');
});