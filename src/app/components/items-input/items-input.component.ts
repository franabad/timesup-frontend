import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-items-input',
  imports: [ReactiveFormsModule],
  templateUrl: './items-input.component.html',
  styleUrl: './items-input.component.css'
})
export class ItemsInputComponent {
  @Input() player!: string
  @Input() isLastPlayer: boolean = false
  @Output() itemsSubmitted = new EventEmitter<string[]>();
  itemsForm;

  constructor(private fb: FormBuilder) {
    this.itemsForm = this.fb.group({
      items: ['']
    });
  }

  onSubmit() {
    const raw = this.itemsForm.value.items || '';
    const lines = raw.split('\n').map(line => line.trim()).filter(line => line !== '');
    this.itemsSubmitted.emit(lines)
    this.itemsForm.reset()
  }
}
