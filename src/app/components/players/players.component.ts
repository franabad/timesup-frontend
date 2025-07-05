import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayersService } from '../../services/player.service';

@Component({
  selector: 'app-players',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
  standalone: true
})
export class PlayersComponent {
  drawTeamsGroup: FormGroup;
  @Output() teams!: Record<string, string[]>;
  showTeamsModal: boolean = false;

  constructor(private fb: FormBuilder, private playerService: PlayersService) {
    this.drawTeamsGroup = this.fb.group({
      players: this.fb.array([])
    });

    for (let i = 0; i < 4; i++) {
      this.addPlayer();
    }

    this.players.valueChanges.subscribe((players: string[]) => {
      this.playerService.setPlayers(players);
    });
  }

  get players(): FormArray {
    return this.drawTeamsGroup.get('players') as FormArray;
  }

  addPlayer() {
    this.players.push(this.fb.control('', Validators.required));
  }

  removePlayer(index: number) {
    if (this.players.length > 1) {
      this.players.removeAt(index);
    }
  }

  pickRandomPlayer(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr.splice(randomIndex, 1)[0];
  }

  drawTeams(players: string[]): Record<string, string[]> {
    const filteredPlayers = players.filter((player: string) => player.trim() !== '')
    const playersCopy = [...filteredPlayers];
    const teams: { [key: string]: string[] } = {}
    let teamCount = 1

    while (playersCopy.length >= 2) {
      const player1 = this.pickRandomPlayer(playersCopy)
      const player2 = this.pickRandomPlayer(playersCopy)

      teams[`Team ${teamCount}`] = [player1, player2]
      teamCount++;
    }

    console.log('Teams drawn:', teams);

    this.playerService.setPlayers(players);
    this.playerService.setShowItemsInput(true);
    this.teams = teams

    this.showTeamsModal = true;
    return teams
  }

  closeModal() {
    this.showTeamsModal = false
  }
}
