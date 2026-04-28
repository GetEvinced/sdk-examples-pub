# Angular Testing Library Unit Tester Example

This project demonstrates how to integrate the [Evinced Unit Tester](https://evinced.com/products/unit-tester) into an Angular project where the [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro) is used to render components.

The key difference between the Angular Testing Library and the Angular TestBed when it comes to testing components is that the Angular Testing Library automatically calls `detectChanges` after events are fired so there is no need to call `fixture.detectChanges()` as long as events are fired using the Angular Testing Library's `fireEvent` function or `user-event` library, as the Unit Tester does.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Running unit tests

To run all unit tests run

```bash
npm run test
```

The Evinced Unit Tester example was implemented on the switch component in the `src/app/switch` directory. The test file is `src/app/switch/switch.component.spec.ts`. To run only the Evinced Unit Tester example test, run:

```bash
npm run test -t switch
```

## Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Additional Resources

For more information on the Evinced Unit Tester, visit the [developer documentation](https://developer.evinced.com/sdks-for-web-apps/unit-tester/).

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
