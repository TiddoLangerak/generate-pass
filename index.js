#!/bin/env node
const argv = require('minimist')(process.argv.slice(2));

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomChar(charList) {
	const charIdx = getRandomInt(0, charList.length);
	return charList.slice(charIdx, charIdx + 1);
}
if (argv['help']) {
	console.log('Usage: generate-pass [options]');
	console.log(`Options:
    --length, -l             Length of password (Default: 20)
    --min-upper, -miu        Minimum number of uppercase characters (Default: 0)
    --max-upper, -mau        Maximum number of uppercase characters (Default: length)
    --min-lower, -mil        Minimum number of lowercase characters (Default: 0)
    --max-lower, -mal        Maximum number of lowercase characters (Default: length)
    --min-number, -minu      Minimum number of number characters (Default: 0)
    --max-number, -manu      Maximum number of number characters (Default: length)
    --min-special, -mis      Minimum special of special characters (Default: 0)
    --max-special, -mas      Maximum special of special characters (Default: length)
    --special-chars, -sc     Valid special characters (Default: !"#$%&'()*+,-./:;<=>?@[\\]^_\`|}~)`);
	return;
}

let size = argv.length || argv.l || 20;
let minUpper = argv['min-upper'] || argv['miu'] || 0;
let maxUpper = argv['max-upper'] || argv['mau'] || size;
let minLower = argv['min-lower'] || argv['mil'] || 0;
let maxLower = argv['max-lower'] || argv['mal'] || size;
let minNumber = argv['min-number'] || argv['minu'] || 0;
let maxNumber = argv['max-number'] || argv['manu'] || size;
let minSpecial = argv['min-special'] || argv['mis'] || 0;
let maxSpecial = argv['max-special'] || argv['mas'] || size;
let specialChars = argv['special-chars'] || argv['sc'] || `!"#$%&'()*+,-./:;<=>?@[\\]^_\`|}~`

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const special = specialChars;

//The strategy is as followed:
//1. Generate characters to satisfy the lower bounds
//2. Generate the remaining characters while satisfying upper bounds
//3. Shuffle generated characters

let passChars = [];
while (minUpper > 0) {
	passChars.push(getRandomChar(upper));
	minUpper--;
	maxUpper--;
}
while (minLower > 0) {
	passChars.push(getRandomChar(lower));
	minLower--;
	maxLower--;
}
while (minNumber > 0) {
	passChars.push(getRandomChar(numbers));
	minNumber--;
	maxNumber--;
}
while (minSpecial > 0) {
	passChars.push(getRandomChar(special));
	minSpecial--;
	maxSpecial--;
}

while(passChars.length < size) {
	let allowed = '';

	if (maxUpper > 0) {
		allowed += upper;
	}
	if (maxLower > 0) {
		allowed += lower;
	}
	if (maxNumber > 0) {
		allowed += numbers;
	}
	if (maxSpecial > 0) {
		allowed += specialChars;
	}

	const char = getRandomChar(allowed);
	passChars.push(char);
	if (lower.includes(char)) {
		maxLower--;
	}
	if (upper.includes(char)) {
		maxUpper--;
	}
	if (numbers.includes(char)) {
		maxNumber--;
	}
	if (special.includes(char)) {
		maxSpecial--;
	}
}


let pass = '';
while (passChars.length) {
	const target = getRandomInt(0, passChars.length);
	pass += passChars.splice(target, 1);
}
console.log(pass);



