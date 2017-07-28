# react-logger-lib

ReactJS/ES6/ES7 logging - lightweight library with managed logging levels, similar to simple logging facades in other languages

## Install
```npm install react-logger-lib --save```

### Why one more library for logging?

This library is a tribute to simple logging facade from other languages and attempt to bring similar pattern into client side programming,
ReactJS and other ES7 applications.

## Benefits
- it allows to manipulate filtration without build tools.
- filtration is based on components hierarchy, see example below
- it is lightweight 2KB gzipped (~8KB original)
- no external dependencies, basically this is a module that you can just copy to you project
- useful for automated unit tests, see example below
- no performance issues (if used properly)

## Typical Usage in React Component

`SidePicker.jsx`
```
import React, { Component } from 'react';
import { Logger } from 'react-logger-lib';

class SidePicker extends Component {

   // Let's imagine some useful component for random side picking
   // One of 4 options should be chosen. And same choise should not repeat

   values = ['left', 'right', 'top', 'bottom' ];
   state = { side: 'left' };

   componentDidMount() {
      Logger.of('App.SidePicker.componentDidMount').info('state=', this.state);
   }

   pickSide = () => {
      // set of possible values to exclude current side
      const values = this.values.slice();
      values.splice(this.values.indexOf(this.state.side), 1);
      Logger.of('App.SidePicker.pickSide.values').info('Set of new values', values);

      // new side is a random pick out of those values
      const side = values[Math.floor(Math.random() * values.length)];
      Logger.of('App.SidePicker.pickSide.side').info('Another side chosen', 'side=', side);

      // save decision into the state
      this.setState({ side });
   }

   pickWrongSide = () => {
      // nothing happens. we produce just a warning, visible in Console
      Logger.of('App.SidePicker.pickWrongSide').warn('Attempt to pick a wrong side');
   }

   render() {
     return (
       <div>
	 <div>Current Side: <strong>{this.state.side}</strong></div>
         <button type='button' onClick={() => (this.pickSide())}>
           PICK ANOTHER SIDE
         </button>
         <button type='button' onClick={() => (this.pickWrongSide())}>
           PICK WRONG SIDE
         </button>
       </div>
     );
   }
}

export default SidePicker;

```
