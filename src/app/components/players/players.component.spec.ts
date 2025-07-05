import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersComponent } from './players.component';

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 4 players', () => {
    expect(component.players.length).toBe(4);
  });

  it('should add a player', () => {
    const initialLength = component.players.length;
    component.addPlayer();
    expect(component.players.length).toBe(initialLength + 1);
  });

  it('should remove a player', () => {
    const initialLength = component.players.length;
    component.removePlayer(0);
    expect(component.players.length).toBe(initialLength - 1);
  });

  it('should draw teams correctly', () => {
    const players = ['Alice', 'Bob', 'Charlie', 'David'];

    const teams = component.drawTeams(players)

    expect(Object.keys(teams).length).toBe(2)

    Object.values(teams).forEach(team => {
      expect(team.length).toBe(2);
    })

    const allAsignedPlayers = Object.values(teams).flat();
    expect(allAsignedPlayers.sort()).toEqual(players.sort());
  });

  it('should return the teams object with correct structure', () => {
    const players = ['Alice', 'Bob', 'Charlie', 'David'];
    const teams = component.drawTeams(players);

    expect(teams).toEqual(jasmine.objectContaining({
      'Team 1': jasmine.any(Array),
      'Team 2': jasmine.any(Array)
    }))
  })
});
