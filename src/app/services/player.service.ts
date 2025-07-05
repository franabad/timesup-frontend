import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private playersSubject = new BehaviorSubject<string[]>([]);
  players$ = this.playersSubject.asObservable();

  private showItemsInputSubject = new BehaviorSubject<boolean>(false)
  showItemsInput$ = this.showItemsInputSubject.asObservable();

  setPlayers(players: string[]) {
    this.playersSubject.next(players);
  }

  setShowItemsInput(show: boolean) {
    this.showItemsInputSubject.next(show);
  }
}
