import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SwitchComponent } from './switch.component';
import EvincedUT from '@evinced/unit-tester';

@Component({
  selector: 'test-switch',
  imports: [SwitchComponent],
  template: '<app-switch label="Dark mode" />',
})
class TestSwitchComponent {
}

describe('SwitchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSwitchComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  });

  it(`should be accessible`, async () => {
    TestBed.createComponent(TestSwitchComponent);
    const results = await EvincedUT.analyzeSwitch({ role: 'switch'});
    expect(results).toHaveNoFailures();
  });

});
