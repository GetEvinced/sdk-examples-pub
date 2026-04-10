import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-switch',
  template: `
    <div>
      <div [attr.id]="labelId">{{ label }}</div>
      <div
        role="switch"
        [attr.aria-checked]="checked"
        tabindex="0"
        (click)="toggle()"
        (keyup)="onKeyUp($event)"
        class="switch"
        [attr.aria-labelledby]="labelId"
      >
        <div class="switch-handle"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .switch {
        width: 50px;
        height: 25px;
        background-color: #ccc;
        border-radius: 25px;
        position: relative;
        cursor: pointer;
        display: inline-block;
      }
      .switch[aria-checked='true'] {
        background-color: #4caf50;
      }
      .switch-handle {
        width: 23px;
        height: 23px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 1px;
        left: 1px;
        transition: left 0.2s;
      }
      .switch[aria-checked='true'] .switch-handle {
        left: 26px;
      }
    `,
  ],
})
export class SwitchComponent {
  @Input() checked = false;
  @Input() label = '';

  labelId = `label-${Math.random().toString(36).substring(2, 11)}`;

  toggle() {
    this.checked = !this.checked;
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }
}
