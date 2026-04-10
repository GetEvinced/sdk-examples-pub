# Angular with Test Bed Unit Tester Example

This project demonstrates how to integrate the [Evinced Unit Tester](https://evinced.com/products/unit-tester) into an Angular project where the Angular TestBed is used to render components

When rendering using `TestBed`, changes to the component are not automatically detected by default. Instead you need to call `fixture.detectChanges()` to trigger change detection. This approach doesn't work with the Evinced Unit Tester since it is framework indepedent and does not call `detectChanges` after events are fired. Using the Angular Testing Library resolves this issue by ensuring that `detectChanges` is called after events are fired. However, it is possible to use the Evinced Unit Tester with the Angular TestBed by configuring the `ComponentFixtureAutoDetect` provider to automatically call `detectChanges` after events are fired.

```typescript
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent],
      providers: [
        // Automatically call `detectChanges` after events are fired
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  });

  // Tests go here
});
```

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
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Additional Resources

For more information on the Evinced Unit Tester, visit the [developer documentation](https://developer.evinced.com/sdks-for-web-apps/unit-tester/).

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
