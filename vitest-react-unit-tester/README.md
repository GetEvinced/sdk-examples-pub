# Vitest + Vite (React)
## 100% Test Coverage Using All Methods

This repository ensures 100% test coverage using all available testing methods.

## Usage

To run the tests, use the following command:

```sh
npm test
```

To test a specific method, you can use the convention: `npm test <componentName>` - for example `npm test modal` or `npm test table`. This works for every method available on the SDK.

You can authenticate Unit Tester with a User if you so wish to. You do need to install the SDK first (either via an .npmrc file or the locale file (if you do not have this, please contact your Evinced contact)) and then you are able to run the following command in the project directory once the SDK has been added to your project:
```sh
npx --package=@evinced/unit-tester login
```

Once you have run the above command you'll be asked to validate a code between the browser and your terminal and you'll be good to go

## Testing Framework

This repository utilizes [Vitest](https://vitest.dev/) to test React-based components that follow best practices.

## To note

If you are seeing issues or the HTML document is empty, have you made sure you are calling:
```sh
attachTo: document.body
```
