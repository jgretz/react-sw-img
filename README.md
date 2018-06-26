# react-sw-img

## What is it?
react-sw-img is dependency free react component that optimizes image loading by using background threads. For more information on background threads or the approach used by this library, please see this [blog article](https://www.joshgretz.io/Fast-Image%20Loading%20for%20React).

## Installation
```
npm install react-sw-img --save
```

or

```
yarn add react-sw-img
```

## Use
Simply import the default export of the library and use it as you would an img tag.

```
import WorkerImage from 'react-sw-img';

<WorkerImage src="https://url.of.image" />
```

In addition, the following properties will be passed through to the resultant component:
* className
* style
* width
* height

## Available Properties
| Property        | Default           | Value  |
| ------------- |:-------------:| -----|
| src | undefined | a string which is the source of the image |
| placeholder | undefined | a string the is the source of the image you want to use until the image provided in src loads |
| background | false | a boolean to render the image as the background of a div rather than an img tag, any children will be rendered inside of the resultant div if true|
| onLoad | undefined | a function to be called when the image is loaded |
| onError | undefined | a function to be called when the image load produces an error |

## Notes
This library will failover to using a JavaScript Image object to load the src provided if the load on the service worker fails.