// maintsx.tsx

// if (typeof DEBUG !== 'undefined' && DEBUG) console.log('DEBUG');
// console.log('typeof DEBUG', typeof DEBUG);

console.log('maintsx.tsx', 'main1');
if (typeof document !== 'undefined')
	document.writeln('maintsx.tsx: main1<br/>');

import sub from './subtsx';
sub();

console.log('maintsx.tsx', 'main9');
