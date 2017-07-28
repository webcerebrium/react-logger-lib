# react-logger-lib

ReactJS/ES6/ES7 logging - lightweight library with managed logging levels, similar to simple logging facades in other languages

## Install
```npm install react-logger-lib --save```

### Why one more library for logging?

This library is a tribute to simple logging facade from other languages and attempt to bring similar pattern into client side programming, ReactJS and other ES7 applications.

## Benefits
- it allows to manipulate filtration without build tools.
- filtration is based on components hierarchy
- it is lightweight 2KB gzipped (~8KB original)
- no external dependencies, basically this is a module that you can just copy to you project
- useful for automated unit tests, where it can trigger warnings according to expectations
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
         <button className='good-button' type='button' onClick={() => (this.pickSide())}>
           PICK ANOTHER SIDE
         </button>
         <button className='bad-button' type='button' onClick={() => (this.pickWrongSide())}>
           PICK WRONG SIDE
         </button>
       </div>
     );
   }
}

export default SidePicker;

```
Once you mount this component into your application, nothing is shown in `Console` tab when launched and when you click the first button, as it is declared under `INFO` level - and suppressed by default (this is why it is basically acceptable for production).

But when you click the second button, *the wrong one*, you will see console.warn
```App.SidePicker.pickWrongSide | Attempt to pick a wrong side``` stating that something wrong happened, though not critical for further application health.

What is the key feature of this approach, is that once written, it is compiled and running, and completely forgotten, you can manage logging level at anytime - and describe what level is required for what component tree in terms of your business logic. This management can be done just by putting `localStorage` variables in your browser.

For this particular example you can use one of the following to enable level at
```
localStorage.setItem('App', 'INFO');
localStorage.setItem('App.SidePicker', 'INFO');
localStorage.setItem('App.SidePicker.pickSide', 'INFO');
localStorage.setItem('App.SidePicker.componentDidMount', 'INFO');
```
and then refresh the page to apply changes for these settings. When loaded and 2 buttons will be clicked, Console will show something like this:
```
App.SidePicker.componentDidMount | state= Object {side: "left"}
App.SidePicker.pickSide.values | Set of new values (3) ["right", "top", "bottom"]
App.SidePicker.pickSide.side | Another side chosen side= top
App.SidePicker.pickWrongSide | Attempt to pick a wrong side
```

## Levels of logging

There are 4 levels of logging currently. From lowest to highest these are `TRACE`-`INFO`-`WARN`-`ERROR`:
- `OFF` suppresses the logging completely:
- `WARN` level will show all messages with `ERROR` level.
- `INFO` level will show all messages with `ERROR` and `WARN` levels as well
- `TRACE` level will show all messages with `INFO`, `WARN` and `ERROR`  levels as well
- `TRACE` is not calling `console.trace`, it is just a logical level in this library

### Disclaimer

- This library is more a pattern to be cloned and configured for your own needs. This is why there are no plugins and extensions like in other similar facades.
- We did it just because we love SLF4J approach in Java, but there was no similar thing in React applications.
- Unlike Java, where component path is taken to logs automatically, here naming is left on responsibility of a writer. Our advice is to keep it as hierarchy of your business logic, as clear and standart as possible.
- Please use wisely on render() methods, extensive logging during rendering is an easy way to downgrade your application performance.
- There is no slowdown noticed when logs are suppressed or not matching their level.
- Feel free to discuss this project under Github `Issues`.
