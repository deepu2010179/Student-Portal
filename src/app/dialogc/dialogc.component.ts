import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogc',
  templateUrl: './dialogc.component.html',
  styleUrl: './dialogc.component.css'
})
export class DialogcComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
