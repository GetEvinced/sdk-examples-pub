import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should create the app', async () => {
    const { fixture } = await render(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular-testing-library-unit-tester' title`, async () => {
    const { fixture } = await render(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-testing-library-unit-tester');
  });

  it('should render title', async () => {
    const { fixture, detectChanges } = await render(AppComponent);
    detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular-testing-library-unit-tester');
  });
});
