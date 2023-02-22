# Groovin

Groovin is a library bringing the power of CSS transitions to Javascript objects.\
Just define the transitions like you would do in CSS and Groovin will do the rest for you!

Here is a basic example:

```javascript
// a dummy object
const myObj = {
    width: 100,
    height: 200,
}

// define transitions for the properties you want to animate
groovin.bind(obj, {
    width: '1s sine-out',
    height: '0.5s circ-in 0.5s',
})

// and now you can simply change the properties' values and Groovin will transition them for you.
// now width will go from 100 to 400 in 1s with the easing function sine-out
myObj.width = 400;

// same for height
// height will go from 200 to 500 in 0.5s with the easing function circ-in and a delay of 0.5s
myObject.height = 500


// let's log the values to see what's happening
setInterval(function() {
    console.log(myObj.width, myObj.height);
});
```

## Installation

Npm
```sh
npm install groovin
```

Yarn
```sh
yarn add groovin
```

Or you can use the files located in the "dist" directory.


## Usage

```javascript
// dummy object
const myObj = {
    width: 10,
    height: 10,
};

// bind an object with transitions
groovin.bind(obj, {
    // properties that will be animated
    width: '1s sine-out',
    height: '2s circ-in 1s',
    ... (all the properties you want)
}, {
    // (optional)
    // you can also add predefined "styles"
    normal: {
        width: 50,
        height: 100,
    },
    hover: {
        width: 100,
        height: 100,
    }
});


// simply set values to animate them
groovin.width = 20;
groovin.height = 30;


// you can also apply a predefined style
// what it simply does is setting the values defined in the predefined styles
groovin.style(obj, 'hover');


// unbind an object so it's not animated anymore
groovin.unbind(obj);


// unbind all objects
groovin.unbindAll();
```

## Functions

### `groovin.bind(obj, transitions, style?)`

Bind an object with transitions.\
The transitions have the format: `duration(s/ms) <easing(param)> <delay(s/ms)>`

*Example: `1.5s sine-out 0.3s` (duration of 1.5s and delay of 0.3s)*\
*Or: `500ms back-out(1.5) 200ms` (duration of 500ms and delay of 200ms)*

### Duration & delay

Duration & delay can be in seconds (ex: 1s) or milliseconds (ex: 500ms)

### Easing

Easing can have an optional parameter. It is totally optional.\
Here is a list of all easing functions included, and their default parameter:
- linear
- sine-in
- sine-out
- sine-inout
- quad-in
- quad-out
- quad-inout
- cubic-in
- cubic-out
- cubic-inout
- quart-in
- quart-out
- quart-inout
- quint-in
- quint-out
- quint-inout
- expo-in
- expo-out
- expo-inout
- circ-in
- circ-out
- circ-inout
- back-in(1.70158)
- back-out(1.70158)
- back-inout(1.70158)
- elastic-in(0.7)
- elastic-out(0.7)
- elastic-inout(0.65)
- bounce-in
- bounce-out
- bounce-inout

*Example: `1.5s sine-out 0.3s` (easing is sine-out)*\
*Or: `500ms back-out(1.5) 200ms` (easing in back-out with optional parameter 1.5)*

You can find a reference to the easing functions used here: [https://easings.net/](https://easings.net/)

### Styles

Predefined styles are optional follow this format:
```javascript
{
    nameOfStyle: {
        property: value,
        ...
    },
    nameOfStyle2: {
        property: value,
        ...
    },
    ...
}
```
\
Example:
```javascript
groovin.bind(obj, {
    width: '1s circ-out', // transition for "width" property
    height: '0.5s sine-in 0.5s', // transition for "height" property
}, {
    // style "normal"
    normal: {
        width: 50,
        height: 50,
    },
    // style "big"
    big: {
        width: 200,
        height: 200,
    }
})

// and you can switch between the different styles by calling:
groovin.style(obj, 'big');
```
\
Usage example with all the parameters:

```javascript
groovin.bind(obj, {
    width: '1s sine-out',
    height: '0.5s circ-in 0.5s',
    left: '500ms back-out(2.5),
    top: '1.5s linear 300ms',
}, {
    normal: {
        width: 50,
        height: 50,
        left: 0,
        top: 0,
    },
    big: {
        width: 200,
        height: 200,
        left: 100,
        top: 200,
    }
})
```

### `groovin.style(obj, styleName)`

Set a predefined style on an object.\
It simply sets the values for the properties defined.\
If the style does not exist, it does nothing.

```javascript
groovin.style(myObj, 'hover');
```

### `groovin.unbind(obj)`

Unbind an object so it's not animated anymore

```javascript
groovin.unbind(myObj);
```

### `groovin.unbindAll()`

Unbind all objects

```javascript
groovin.unbindAll();
```
