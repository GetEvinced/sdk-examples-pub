# Evinced Unit Tester

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
| `components/Accordion.test.js` | `analyzeAccordion` | |
| `components/Breadcrumbs.test.js` | `analyzeBreadcrumb` | |
| `components/Button.test.js` | `analyzeButton` | |
| `components/Carousel.test.js` | `analyzeCarousel` | |
| `components/Checkbox.test.js` | `analyzeCheckbox` | |
| `components/Combobox.test.js` | `analyzeCombobox` | |
| `components/Datagrid.test.js` | `analyzeDataGrid` | |
| `components/Disclosure.test.js` | `analyzeDisclosure` | |
| `components/Feed.test.js` | `analyzeFeed` | |
| `components/LabelCheck.test.js` | `analyzeButton` | Validates that the component has a correct accessible label |
| `components/Link.test.js` | `analyzeLink` | |
| `components/Listbox.test.js` | `analyzeListbox` | |
| `components/Menu.test.js` | `analyzeMenu` | |
| `components/MenuButton.test.js` | `analyzeMenuButton` | |
| `components/Meter.test.js` | `analyzeMeter` | |
| `components/Modal.test.js` | `analyzeModal` | |
| `components/MultipleComponents.test.js` | `analyzeButton` | Iterates over multiple button elements in one test |
| `components/MultiThumbSlider.test.js` | `analyzeMultiThumbSlider` | |
| `components/RadioGroup.test.js` | `analyzeRadioGroup` | |
| `components/SiteNavigation.test.js` | `analyzeSiteNavigation` | |
| `components/Slider.test.js` | `analyzeSlider` | |
| `components/SpinButton.test.js` | `analyzeSpinButton` | |
| `components/Switch.test.js` | `analyzeSwitch` | |
| `components/Table.test.js` | `analyzeTable` | |
| `components/TabList.test.js` | `analyzeTabList` | |
| `components/TextInput.test.js` | `analyzeTextInput` | |
| `components/ToggleButton.test.js` | `analyzeToggleButton` | |
| `components/ToggleSwitch.test.js` | `analyzeSwitch` | |

## Testing Framework

This repository utilizes [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and Jest to test React-based components that follow best practices.
