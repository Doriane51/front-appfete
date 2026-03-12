import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div style="background-color: green; color: white; padding: 20px;">
      TEST COMPOSANT - SI VOUS VOYEZ ÇA, ANGULAR FONCTIONNE
    </div>
  `
})
export class TestComponent {}
