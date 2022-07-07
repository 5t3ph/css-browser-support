# css-browser-support

> Query for **CSS browser support data**, combined from caniuse and MDN, including version support started and global support percentages.

## Usage

Install the package:

```bash
npm i --save-dev css-browser-support
```

Then import it into your project:

```js
const { cssBrowserSupport } = require("css-browser-support");
```

And call it by passing a string or an array of strings containing the CSS features you'd like to query support:

```js
cssBrowserSupport([
  "aspect-ratio",
  "margin-inline",
  "border-radius",
  ":nth-last-child",
  "@layer",
  "gap",
]);
```

Returns an object that includes each browser for which support is available, example for `aspect-ratio`:

```js
{
  'aspect-ratio': {
    chrome: {
      sinceVersion: '88',
      flagged: true,
      globalSupport: 22.46,
      browserTitle: 'Chrome'
    },
    chrome_android: {
      sinceVersion: '88',
      flagged: false,
      globalSupport: 41.34,
      browserTitle: 'Chrome Android'
    },
    edge: {
      sinceVersion: '88',
      flagged: false,
      globalSupport: 3.88,
      browserTitle: 'Edge'
    },
    // ... continued for all browsers
    globalSupport: 86.49
  }
}
```

## Supported CSS features

The API is intended to work for passing features as you would write them in CSS. As such, a few things will not be available if they exist on MDN under an expanded name. For example, `>` would be available as `child`.

Additionally, some features are nested and may be missed by the API. Exceptions are grid features (ex. `repeat()`), and color types (ex. `color-contrast()`) which have been explicitly included.

Review the data from MDN:

- [at-rules](https://github.com/mdn/browser-compat-data/tree/main/css/at-rules)
- [properties](https://github.com/mdn/browser-compat-data/tree/main/css/properties)
- [selectors](https://github.com/mdn/browser-compat-data/tree/main/css/selectors)
- [types](https://github.com/mdn/browser-compat-data/tree/main/css/types)

### Special case: `gap`

Since `gap` is a popular feature known to have been implemented for both flexbox and grid at different times, the API splits a request for `gap` to return support for both implementations.

In your implementation, you'll want to check for an input of `gap` and then update to handle for the two returned keys of `gap - flexbox` and `gap - grid`.

Example:

```js
if (queries.includes("gap")) {
  queries.splice(queries.indexOf("gap"), 1);
  queries.push("gap - flexbox");
  queries.push("gap - grid");
}
```

## Implementing the data

- if your implementation accepts properties with values, ex `margin-inline: auto`, you are responsible for removing values before passing the property to the API
- due to the data returned from MDN, characters like `:` are stripped from selectors and pseudo-elements, and `@` is removed from at-rule, so for example `@layer` will be found in returned data as `layer`

For an example on using this data, see my Eleventy plugin implementation: **@11tyrocks/eleventy-plugin-css-browser-support**

- [npm](https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-css-browser-support)
- [GitHub repo](https://github.com/5t3ph/eleventy-plugin-css-browser-support)

## Browser list

You can also import the full browser list as `BROWSERS`:

```js
const { cssBrowserSupport, BROWSERS } = require("css-browser-support");
```

<details>
<summary>View full browser list</summary>

The list is as follows:

```js
[
  "chrome",
  "chrome_android",
  "edge",
  "firefox",
  "firefox_android",
  "ie",
  "opera",
  "safari",
  "safari_ios",
  "samsunginternet_android",
];
```

</details>

## Credits

Two packages are being used to obtain support data:

- [@mdn/browser-compat-data]()
- [caniuse-lite]()
