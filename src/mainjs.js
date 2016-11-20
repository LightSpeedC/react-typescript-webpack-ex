// mainjs.js

if (typeof DEBUG !== 'undefined' && DEBUG) console.log('DEBUG');
console.log('typeof DEBUG', typeof DEBUG);

console.log('mainjs.js', 'main1');
if (typeof document !== 'undefined')
	document.writeln('mainjs.js: main1<br/>');

var sub = require('./subjs');
sub();

console.log('mainjs.js', 'main9');
