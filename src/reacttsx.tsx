// reacttsx.tsx

import * as React from 'react';
import * as ReactDOM from 'react-dom';

//ReactDOM.render(React.createElement('div', {}, 'Hello'), window['reacttsx']);
//ReactDOM.render(<div>Hello</div>, window['reacttsx']);
ReactDOM.render(<div>Hello</div>, document.getElementById('reacttsx'));

if (typeof document !== 'undefined')
	document.writeln('reaxttsx.tsx<br/>');
