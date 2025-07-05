import { Component, Input, OnInit } from '@angular/core';
import { ItemsInputComponent } from '../items-input/items-input.component';
import { PlayersService } from '../../services/player.service';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-items-form',
  imports: [ItemsInputComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './items-form.component.html',
  styleUrl: './items-form.component.css'
})
export class ItemsFormComponent implements OnInit {
  players!: string[]
  currentPlayerIndex: number = 0
  allItems: string[] = []
  showDuplicatesModal: boolean = false
  duplicates: string[] = []
  editedDuplicates: string[] = []
  editedDuplicatesText: string = '';

  constructor(private playersService: PlayersService) { }

  get isLastPlayer(): boolean {
    return this.currentPlayerIndex === this.players.length - 1
  }

  ngOnInit(): void {
    this.playersService.players$.subscribe(players => {
      this.players = players
      this.currentPlayerIndex = 0
    })
  }

  normalizeItems(word: string): string {
    return word
      .toLowerCase()
      .normalize('NFD')                       // Separa letras y acentos
      .replace(/[\u0300-\u036f]/g, '')        // Elimina los acentos
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Quita signos de puntuación
      .trim()
  }

  handleItemsSubmitted(items: string[]) {
    this.allItems.push(...items.map(item => this.normalizeItems(item)));

    if (this.currentPlayerIndex < this.players.length - 1) {
      this.currentPlayerIndex++;
    } else {
      this.finish()
    }
  }

  findDuplicates(arr: string[]): string[] {
    const seen = new Set<string>()
    const duplicates = new Set<string>()

    for (const rawItem of arr) {
      const item = this.normalizeItems(rawItem)
      if (seen.has(item)) {
        duplicates.add(item)
      } else {
        seen.add(item)
      }
    }

    return Array.from(duplicates)
  }

  finish() {
    console.log('All items collected:', this.allItems)
    const duplicates = this.findDuplicates(this.allItems)

    if (duplicates.length === 0) {
      // LLamada api
    } else {
      this.duplicates = duplicates
      this.showDuplicatesModal = true
    }

    this.showDuplicatesModal = true
  }

  // checkDuplicates() {
  //   this.editedDuplicates = this.editedDuplicatesText
  //     .split('\n')
  //     .map(w => w.trim())
  //     .filter(w => w !== '');

  //   const tempItems = this.allItems.filter(item => !this.duplicates.includes(item)).concat(this.editedDuplicates)

  //   const newDuplicates = this.findDuplicates(tempItems)

  //   if (newDuplicates.length === 0) {
  //     // LLamada api
  //     console.log('No duplicates found, proceeding with:', tempItems)
  //     this.duplicates = []
  //   } else {
  //     this.duplicates = newDuplicates
  //     this.editedDuplicates = newDuplicates
  //     this.editedDuplicatesText = newDuplicates.join('\n')
  //   }

  //   console.log(tempItems)
  // }


  checkDuplicates() {
    this.editedDuplicates = this.editedDuplicatesText
      .split('\n')
      .map(i => this.normalizeItems(i))
      .filter(i => i !== '');

    // 1) Eliminar del array original las palabras duplicadas detectadas anteriormente
    const cleanedItems = this.allItems.filter(
      item => !this.duplicates.includes(item)
    );

    // 2) Crear el nuevo array combinado con cleanedItems + las nuevas palabras editadas
    const tempItems = cleanedItems.concat(this.editedDuplicates);

    // 3) Buscar duplicados en el array actualizado
    const newDuplicates = this.findDuplicates(tempItems);

    if (newDuplicates.length === 0) {
      // 🎉 No hay duplicados: actualizamos allItems y cerramos el modal
      this.allItems = tempItems;
      console.log('No duplicates found, proceeding with:', tempItems);
      this.duplicates = [];
      // this.closeModal();
    } else {
      // 🔁 Todavía hay duplicados: actualizamos allItems PARCIALMENTE para no perder los cambios
      this.allItems = tempItems; // <-- ESTA LÍNEA ES CLAVE
      this.duplicates = newDuplicates;
      this.editedDuplicates = newDuplicates;
      this.editedDuplicatesText = newDuplicates.join('\n');
    }
  }

  closeModal() {
    this.showDuplicatesModal = false;
  }
}
