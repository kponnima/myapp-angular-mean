import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, BehaviorSubject, of } from 'rxjs';

export interface DialogData {
  target: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>,private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }

  continue() {
    this.dialogRef.close();
    this.router.navigate([this.data.target]);
  }

  close() {
      this.dialogRef.close();
  }
}
