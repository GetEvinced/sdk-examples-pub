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

## Test Files

| File | SDK Method | Notes |
|------|-----------|-------|
| `components/Accordion.test.jsx` | `analyzeAccordion` | Options: `userEventOptions` |
| `components/Breadcrumbs.test.jsx` | `analyzeBreadcrumb` | Passes DOM element directly |
| `components/Button.test.jsx` | `analyzeButton` | Selector by role |
| `components/Carousel.test.jsx` | `analyzeCarousel` | Options: `automaticRotation`, slide controls |
| `components/Checkbox.test.jsx` | `analyzeCheckbox` | Options: `userEventOptions` |
| `components/Combobox.test.jsx` | `analyzeCombobox` | Passes DOM element directly |
| `components/Datagrid.test.jsx` | `analyzeDataGrid` | Passes DOM element directly |
| `components/Disclosure.test.jsx` | `analyzeDisclosure` | Options: `evalEscape` |
| `components/Feed.test.jsx` | `analyzeFeed` | Passes container element |
| `components/Link.test.jsx` | `analyzeLink` | Passes DOM element directly |
| `components/Listbox.test.jsx` | `analyzeListbox` | Passes DOM element directly |
| `components/Menu.test.jsx` | `analyzeMenu` | Passes DOM element directly |
| `components/MenuButton.test.jsx` | `analyzeMenuButton` | Passes DOM element directly |
| `components/Meter.test.jsx` | `analyzeMeter` | Passes DOM element directly |
| `components/Modal.test.jsx` | `analyzeModal` | Options: `modalLocator` |
| `components/MultipleComponents.test.jsx` | `analyzeButton` | Iterates over multiple elements |
| `components/MultiThumbSlider.test.jsx` | `analyzeMultiThumbSlider` | Passes DOM element directly |
| `components/Popup.test.jsx` | `analyzeModal` | Popup (dialog) rendered open |
| `components/RadioGroup.test.jsx` | `analyzeRadioGroup` | Passes DOM element directly |
| `components/SiteNavigation.test.jsx` | `analyzeSiteNavigation` | Passes DOM element directly |
| `components/Slider.test.jsx` | `analyzeSlider` | Passes DOM element directly |
| `components/SpinButton.test.jsx` | `analyzeSpinButton` | Passes DOM element directly |
| `components/Switch.test.jsx` | `analyzeSwitch` | Passes DOM element directly |
| `components/Table.test.jsx` | `analyzeTable` | Passes DOM element directly |
| `components/TabList.test.jsx` | `analyzeTabList` | Passes DOM element directly |
| `components/TextInput.test.jsx` | `analyzeTextInput` | Passes DOM element directly |
| `components/ToggleButton.test.jsx` | `analyzeToggleButton` | Passes DOM element directly |
| `components/ToggleSwitch.test.jsx` | `analyzeSwitch` | Options: `userEventOptions` |

## Testing Framework

This repository utilizes [Vitest](https://vitest.dev/) to test React-based components that follow best practices.

## To note

If you are seeing issues or the HTML document is empty, have you made sure you are calling:
```sh
attachTo: document.body
```
