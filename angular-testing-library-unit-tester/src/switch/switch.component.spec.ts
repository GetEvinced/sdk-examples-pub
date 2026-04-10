import { render } from '@testing-library/angular';
import { SwitchComponent } from './switch.component';
import EvincedUT from '@evinced/unit-tester';


describe('SwitchComponent', () => {

  it(`should be accessible`, async () => {
    await render(SwitchComponent, { inputs: { label: 'Dark mode' } });
    const results = await EvincedUT.analyzeSwitch({ role: 'switch'});
    // console.log(results)
    /* The analyzeSwitch() method should output the tests that were applied.
    It will contain an array of the tests including the component tested, the 
    pass/fail value, a short message, and a link to the Evinced validation tested.
    For example:
    [
          {
            component: 'Switch',
            test: 'role',
            members: [ '.switch' ],
            pass: true,
            message: 'Switch element has a role of switch',
            violationType: null,
            link: 'https://knowledge.evinced.com/components/Switch#role'
          },
          ...
    ]
    */ 
    expect(results).toHaveNoFailures();
  });

});
