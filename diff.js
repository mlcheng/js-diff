/***********************************************

  "diff.js"

  Created by Michael Cheng on 07/22/2016 09:55
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

var iqwerty = iqwerty || {};
iqwerty.diff = (function() {

	const MAX_DISTANCE = Number.MAX_SAFE_INTEGER;
	const FROM = 'from';
	const TO = 'to';
	const LDIS = 'levenshteinDistance';
	const CHANGES = 'changes';

	function DiffObject(diff) {
		Object.assign(this, diff);
	}

	DiffObject.prototype.toString = function() {
		return diffToString(this);
	};

	function Diff(str1, str2) {
		// Do Levenshtein distance
		let dp = [];

		// Initialize matrix
		for(let i=0; i<str1.length+1; i++) {
			dp[i] = [];
			for(let j=0; j<str2.length+1; j++) {
				if(!i) dp[i][j] = j;
				else if(!j) dp[i][j] = i;
				else dp[i][j] = 0;
			}
		}

		// Build the Levenshtein distance matrix using dynamic programming
		for(let i=0; i<str1.length; i++) {
			for(let j=0; j<str2.length; j++) {
				if(str2.charAt(j) === str1.charAt(i)) {
					dp[i+1][j+1] = dp[i][j];
				} else {
					dp[i+1][j+1] = Math.min(dp[i][j+1], dp[i][j], dp[i+1][j])+1;
				}
			}
		}

		// Matrix is built, now look for changes needed
		let changes = [];
		{
			let i = str1.length, j = str2.length;
			while(j > 0 || i > 0) {
				let up, diagonal, left;
				if(i-1 < 0) {
					up = MAX_DISTANCE;
				} else {
					up = dp[i-1][j];
				}
				if(j-1 < 0) {
					left = MAX_DISTANCE;
				} else {
					left = dp[i][j-1];
				}
				if(i-1 < 0 || j-1 < 0) {
					diagonal = MAX_DISTANCE;
				} else {
					diagonal = dp[i-1][j-1];
				}
				let source = Math.min(up, diagonal, left);

				// Exit if the source is no longer available
				if(source === MAX_DISTANCE) break;

				if(source === diagonal) {
					/*
					Came from diagonal
					Check to see if letters are the same first
					If they aren't the same, then a replacement was done
					 */
					let char, diff;
					if(str1[i-1] === str2[j-1]) {
						char = str1[i-1];
						diff = '=';
					} else {
						char = str2[j-1];
						diff = {
							replace: str1[i-1]
						};
					}
					changes.push({ char, diff });
					i -= i ? 1 : 0;
					j--;
				} else if(source === up) {
					/*
					Came from above
					Means remove str1's char
					 */
					changes.push({
						char: str1[i-1],
						diff: '-'
					});
					i--;
				} else if(source === left) {
					/*
					Came from left
					Means add str2's char
					 */
					changes.push({
						char: str2[j-1],
						diff: '+'
					});
					j--;
				}
			}
		}

		changes.reverse();

		return new DiffObject({
			[FROM]: str1,
			[TO]: str2,
			[LDIS]: dp[str1.length][str2.length],
			[CHANGES]: changes
		});
	}

	function diffToString(diff) {
		return diff.changes.reduce((out, d) => {
			let string = '';
			if(typeof d.diff === 'object') {
				string += `(-${d.diff.replace})(+${d.char})`;
			} else {
				if(d.diff === '=') {
					string += d.char;
				} else {
					string += `(${d.diff}${d.char})`;
				}
			}
			return out + string;
		}, '');
	}

	return {
		Diff
	};
})();