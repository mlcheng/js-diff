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

	const DiffObjectProp = {
		FROM: 'from',
		TO: 'to',
		LDIS: 'levenshteinDistance',
		CHANGES: 'changes'
	};


	function DiffObject(obj) {
		Object.assign(this, obj);
	}


	DiffObject.prototype.toString = function() {
		return diffToString(this);
	};


	function Diff(from, to) {
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
					if(from.charAt(i-1) === to.charAt(j-1)) {
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
				if(from.charAt(i-1) === to.charAt(j-1)) {
					// No changes from source to destination
					char = from.charAt(i-1), diff = '=';
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
						char = to.charAt(j-1), diff = '+';
						j--;
					} else if(source === up) {
						// Removed character from source
						char = from.charAt(i-1), diff = '-';
						i--;
					} else if(source === diagonal) {
						// Destination character replace source
						char = from.charAt(i-1), diff = {
							replacedBy: to.charAt(j-1)
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
			[DiffObjectProp.LDIS]: steps[from.length][to.length]
		});
	}

	function diffToString(diffObject) {
		// Specifies the index at which a group ends
		let groupBy = [], changes = diffObject.changes;

		for(let i=1; i<changes.length; i++) {
			if(changes[i].diff !== changes[i-1].diff || typeof changes[i].diff === 'object') {
				groupBy.push(i-1);
			}
		}
		groupBy.push(changes.length-1);

		let out = '', pointer = 0;
		for(let i=0; i<groupBy.length; i++) {
			if(typeof changes[pointer].diff === 'object') {
				out += `(-${changes[pointer].char})(+${changes[pointer].diff.replacedBy})`;
			} else {
				if(changes[pointer].diff !== '=') {
					out += `(${changes[pointer].diff}`;
				}
				for(let j=pointer; j<=groupBy[i]; j++) {
					out += `${changes[j].char}`;
				}
				if(changes[pointer].diff !== '=') {
					out += ')';
				}
			}
			pointer = groupBy[i]+1;
		}
		return out;
	}

	return {
		Diff
	};
})();