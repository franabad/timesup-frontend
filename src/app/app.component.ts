import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayersComponent } from './components/players/players.component';
import { ItemsFormComponent } from "./components/items-form/items-form.component";
import { PlayersService } from './services/player.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayersComponent, ItemsFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showItemsInput!: boolean;

  constructor(private playersService: PlayersService) {
    this.playersService.showItemsInput$.subscribe(show => {
      this.showItemsInput = show;
    });
  }

  title = 'timesup-custom';
}
