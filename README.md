# React Scrolling Progress
<p align="center">
  <img src="https://badgen.net/npm/license/@bogachenkov/react-scrolling-progress" />
  <img src="https://badgen.net/npm/v/@bogachenkov/react-scrolling-progress" />
  <img src="https://badgen.net/npm/dt/@bogachenkov/react-scrolling-progress" />
  <img src="https://badgen.net/packagephobia/install/@bogachenkov/react-scrolling-progress/" />
  <img src="https://badgen.net/npm/dependents/@bogachenkov/react-scrolling-progress" />
</p>

React component (based on HTML `<progress>` element)  that shows the progress of  the scroll and listens to the target element height changes. It also returns `useScrollProgress` hook in case you want to use your own progress bar.



## Installation

```
npm install @bogachenkov/react-scrolling-progress
```

or

```
yarn add @bogachenkov/react-scrolling-progress
```



## Table of contents

* [Basic Usage](#basic-usage)
* [Properties](#properties)
* [State](#state)



## Basic Usage

#### ReactScrollProgress with no configuration

By default it will be tracking for `document.documentElement` scroll progress.

```jsx
import React from "react";
import ReactScrollProgress from "@bogachenkov/react-scrolling-progress";

const MyComponent = () => {
  ...
  return (
    <>
      <ReactScrollProgress />
      ...
    </>
  )
}
```

---



#### ReactScrollProgress with some configuration

```jsx
import React, { useRef } from "react";
import ReactScrollProgress from "@bogachenkov/react-scrolling-progress";

const MyComponent = () => {
    const targetElementRef = useRef();
    return (
        <div ref={targetElementRef}>
          <ReactScrollProgress
            styles={{
              position: 'sticky',
              top: '5px',
              colors: [ '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F','#F9F871']
            }}
            scrollOptions={{
              targetElement: ref,
              detectByElementBottom: true
            }}
          />
          ...
        </div>
    )
}
```

---



#### useScrollProgress

```jsx
import React from "react";
import { useScrollProgress } from "@bogachenkov/react-scrolling-progress";

const MyComponent = () => {
    const { targetElement, progressNumber, progressString } = useScrollProgress({
      precision: 4,
      detectByElementBottom: true,
      useTargetElement: true
    });
    return (
      <div ref={targetElement}>
        <CustomScrollBar value={progressNumber} />
        ... // OR
        <div style={{width: progressString}}></div>
      </div>
    )
}
```

Also you can use `targetElement` instead of `useTargetElement`  and passed your own `ref` to it:

```jsx
import React, { useRef } from "react";
import { useScrollProgress } from "@bogachenkov/react-scrolling-progress";

const MyComponent = () => {
    const targetElementRef = useRef();
    const { targetElement, progressNumber, progressString } = useScrollProgress({
      precision: 4,
      detectByElementBottom: true,
      targetElement: targetElementRef
    });
    return (
      <div ref={targetElementRef}>
        <CustomScrollBar value={progressNumber} />
        ... // OR
        <div style={{width: progressString}}></div>
      </div>
    )
}
```

`targetElement` and `useTargetElement` fields are mutually exclusive, so you should use only one of them.



## Properties

#### ReactScrollProgress

- `scrollOptions`:

  |         **Key**         |             Type              | Default |                         Description                          |
  | :---------------------: | :---------------------------: | :-----: | :----------------------------------------------------------: |
  |     `targetElement`     | `React.MutableRefObject<any>` | `null`  | A ref that will be assigned to the element you want to track . By default it will be tracking scroll for `document.documentElement`. |
  | `detectByElementBottom` |           `boolean`           | `false` | If set to `true`, then the progress of scrolling will be equal to 100% at the moment when the bottom border of the element appears in the viewport.<br />If set to `false`, then the progress will be equal to 100% only when you will scroll the whole element. |

- `styles`:

  |      **Key**      |               Type                |         Default          |                         Description                          |
  | :---------------: | :-------------------------------: | :----------------------: | :----------------------------------------------------------: |
  |     `height`      |  `React.CSSProperties['height']`  |         `'5px'`          |                   Height of the scrollbar                    |
  |      `width`      |  `React.CSSProperties['width']`   |         `'100%'`         |                    Width of the scrollbar                    |
  |    `position`     | `React.CSSProperties['position']` |         `fixed`          |                      Valid CSS-position                      |
  |       `top`       |   `React.CSSProperties['top']`    |            0             |                 CSS-position `top` property                  |
  |      `left`       |   `React.CSSProperties['left']`   |            0             |                 CSS-position `left` property                 |
  | `backgroundColor` |  `React.CSSProperties['color']`   |        `#EEEEEE`         |     Background color of the progress bar **container**.      |
  |     `colors`      | `React.CSSProperties['color'][]`  | `['#319197', '#fb7319']` | Array of colors used to create the gradient-color of the progress bar. If you want only one color, just pass the array with that color. |
  |   `showStripes`   |             `boolean`             |          `true`          |                 Show/hide gradient stripes.                  |
  |  `showBarShadow`  |             `boolean`             |          `true`          |     Show/hide shadows in the progress bar **container**      |



#### useScrollProgress

- `options`:

  |         **Key**         |             Type              | Default |                         Description                          |
  | :---------------------: | :---------------------------: | :-----: | :----------------------------------------------------------: |
  |     `targetElement`     | `React.MutableRefObject<any>` | `null`  | A ref that will be assigned to the element you want to track . By default it will be tracking scroll for `document.documentElement`.<br />**Cannot be used with** `useTargetElement` |
  |   `useTargetElement`    |           `boolean`           | `false` | If set to `true`, the hook will return a ref that needs to be assigned to the element you want to track.<br />**Cannot be used with** `targetElement` |
  |       `precision`       |           `number`            |    3    | Decimal places of the percentage that will be returned from hook |
  | `detectByElementBottom` |           `boolean`           | `false` | If set to `true`, then the progress of scrolling will be equal to 100% at the moment when the bottom border of the element appears in the viewport.<br />If set to `false`, then the progress will be equal to 100% only when you will scroll the whole element. |



## State

```jsx
const { progressString, progressNumber, targetElement? } = useScrollProgress(options?)
```



|       Name       |                Type                 |                         Description                          |
| :--------------: | :---------------------------------: | :----------------------------------------------------------: |
| `progressString` |              `string`               |   The progress value represented by a string like `'100%'`   |
| `progressNumber` |              `number`               |                      The progress value                      |
| `targetElement`  | `MutableRefObject<any> \| undefined` | A ref that needs to be assigned to the element you want to track. It will returns only if you passed `useTargetElement` key to `options` object. |

