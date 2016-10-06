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

	const SplitBy = {
		CHAR: '',
		WORD: '(\\s)',
		LINE: '(\\n)'
	};

	const DEFAULT_SPLITTER = SplitBy.CHAR;

	const DiffObjectProp = {
		FROM: 'from',
		TO: 'to',
		LDIS: 'levenshteinDistance',
		CHANGES: 'changes',
		SPLITTER: 'splitter'
	};


	function DiffObject(obj) {
		Object.assign(this, obj);
	}


	DiffObject.prototype.toString = function() {
		return diffToString(this);
	};


	function Diff(from, to, splitBy = DEFAULT_SPLITTER) {

		let splitter = from.match(new RegExp(splitBy));

		splitter = splitter ? splitter.shift() : '';

		from = from.split(new RegExp(splitBy, 'g'));
		to = to.split(new RegExp(splitBy, 'g'));


		// Dynamic programming matrix
		let steps = [];

		// Initialize the matrix that shows the steps needed to make each change
		for(let i=0; i<=from.length; i++) {
			steps[i] = [];
			for(let j=0; j<=to.length; j++) {
				if(i === 0) steps[i][j] = j;
				else if(j === 0) steps[i][j] = i;
				else steps[i][j] = 0;
			}
		}


		// Build the Levenshtein distance matrix
		{
			let left, diagonal, up;
			for(let i=1; i<=from.length; i++) {
				for(let j=1; j<=to.length; j++) {
					left = steps[i][j-1];
					diagonal = steps[i-1][j-1];
					up = steps[i-1][j];
					if(from[i-1] === to[j-1]) {
						// Current characters are same, so inherit from last LCS (which is diagonal)
						steps[i][j] = diagonal;
					} else {
						// Another difference, so add one to the last optimal LCS
						steps[i][j] = Math.min(left, diagonal, up) + 1;

					}
				}
			}
		}

		//Traverse the matrix to get the differences
		let changes = [];
		{
			let i = from.length, j = to.length, left, diagonal, up, source, char, diff;
			while(i > 0 || j > 0) {
				if(from[i-1] === to[j-1]) {
					// No changes from source to destination
					char = from[i-1], diff = '=';
					i--;
					j--;
				} else {
					if(i-1 < 0) {
						up = MAX_DISTANCE;
					} else {
						up = steps[i-1][j];
					}
					if(j-1 < 0) {
						left = MAX_DISTANCE;
					} else {
						left = steps[i][j-1];
					}
					if(i-1 < 0 || j-1 < 0) {
						diagonal = MAX_DISTANCE;
					} else {
						diagonal = steps[i-1][j-1];
					}
					source = Math.min(left, up, diagonal);
					if(source === left) {
						// New character from destination
						char = to[j-1], diff = '+';
						j--;
					} else if(source === up) {
						// Removed character from source
						char = from[i-1], diff = '-';
						i--;
					} else if(source === diagonal) {
						// Destination character replace source
						char = from[i-1], diff = {
							replacedBy: to[j-1]
						};
						i--;
						j--;
					}
				}
				changes.push({ char, diff });
			}
		}

		return new DiffObject({
			[DiffObjectProp.FROM]: from,
			[DiffObjectProp.TO]: to,
			[DiffObjectProp.CHANGES]: changes.reverse(),
			[DiffObjectProp.LDIS]: steps[from.length][to.length],
			[DiffObjectProp.SPLITTER]: splitter
		});
	}

	function _flatten(obj) {
		let out = [];
		for(let i=0; i<obj.length; i++) {
			let _d = obj[i];
			if(typeof _d.diff === 'object') {
				out.push({
					char: _d.char,
					diff: '-'
				});
				out.push({
					char: _d.diff.replacedBy,
					diff: '+'
				});
			} else {
				out.push(_d);
			}
		}
		return out;
	}

	function _group(diffs) {
		let remove = '', add = '', equals = '', out = [];
		for(let i=0; i<diffs.length; i++) {
			if(diffs[i].diff !== '=') {
				if(equals) {
					out.push({
						char: equals,
						diff: '='
					});
					equals = '';
				}

				if(diffs[i].diff === '-') {
					remove += diffs[i].char;
				} else {
					add += diffs[i].char;
				}
			} else {
				// Add the minuses and pluses to the output and reset for next round
				if(remove) {
					out.push({
						char: remove,
						diff: '-'
					});
					remove = '';
				}
				if(add) {
					out.push({
						char: add,
						diff: '+'
					});
					add = '';
				}

				// Add the equals until the next non-equal
				equals += diffs[i].char;
			}
		}
		// Push the rest of the stuff in
		if(remove) {
			out.push({
				char: remove,
				diff: '-'
			});
		}
		if(add) {
			out.push({
				char: add,
				diff: '+'
			});
		}
		if(equals) {
			out.push({
				char: equals,
				diff: '='
			});
		}
		return out;
	}

	function diffToString(diffObject) {
		// I think the logic is: group everything until the next '='
		let flattened = _flatten(diffObject.changes);
		flattened = _group(flattened);


		let plainText = '', richText = '';
		for(let i=0; i<flattened.length; i++) {
			let cur = flattened[i];
			if(cur.diff === '=') {
				plainText += cur.char;
				richText += cur.char;
			} else {
				let txt = `(${cur.diff}${cur.char})`;
				plainText += txt;
				richText += `<span class="iqwerty-diff-${cur.diff === '+' ? 'add' : 'remove'}">${txt}</span>`;
			}
		}

		return { plainText, richText };
	}

	return {
		Diff,
		SplitBy
	};
})();