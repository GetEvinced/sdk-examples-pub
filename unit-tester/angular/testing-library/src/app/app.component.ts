import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwitchComponent } from "../switch/switch.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SwitchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-testing-library-unit-tester';
}
