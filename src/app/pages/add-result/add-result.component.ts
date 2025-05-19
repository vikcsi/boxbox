import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';
import { Result } from '../../shared/models/RaceResult';
import { Driver } from '../../shared/models/Driver';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-result',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {

  @Input({ required: true }) trackId!: string;
  @Input() cancelLink: string | any[] = '/';

  @Output() resultAdded = new EventEmitter<Result[]>();

  private fb = inject(NonNullableFormBuilder);
  private data = inject(FirestoreDataService);
  
  drivers: Driver[] = [];
  fastestLapAlreadySet = false;
  existingResults: Result[] = [];

  form = this.fb.group({
    results: this.fb.array(
      Array.from({ length: 10 }, (_, i) =>
        this.fb.group({
          driverID: ['', Validators.required],
          position: this.fb.control(i + 1, { validators: [Validators.min(1)] }),
          points: this.fb.control(this.calculateDefaultPoints(i + 1), { validators: [Validators.min(0)] }),
          time: ['', Validators.required],
          fastestLap: [false, Validators.required]
        })
      )
    )
  });

  ngOnInit(): void {
    this.data.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });

    this.data.getResults(this.trackId).subscribe(results => {
      this.existingResults = results;
      this.fastestLapAlreadySet = results.some(r => r.fastestLap === true);
    });

    this.resultsFormArray.forEach((group, index) => {
      group.get('fastestLap')?.valueChanges.subscribe(isChecked => {
        if (isChecked) {
          this.clearOtherFastestLaps(index);
        }
      });
    });
  }

  private calculateDefaultPoints(position: number): number {
    const pointsMap: {[key: number]: number} = {
      1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1
    };
    return pointsMap[position] || 0;
  }

  private clearOtherFastestLaps(currentIndex: number): void {
    this.resultsFormArray.forEach((group, index) => {
      if (index !== currentIndex && group.get('fastestLap')?.value === true) {
        group.get('fastestLap')?.setValue(false, { emitEvent: false });
      }
    });
  }


  async save() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
        control?.markAsDirty();
      });
      return;
    }

    const formResults = this.form.get('results')?.value;
    if (!formResults) return;

    const results: Result[] = formResults.map((r: any, index: number) => ({
      driverID: r.driverID,
      position: r.position,
      points: r.points,
      time: r.time,
      fastestLap: r.fastestLap || false
    }));

    try {
      await this.data.setRaceResults(this.trackId, results);
      this.resultAdded.emit(results);
    } catch (error) {
    }
  }

  get resultsFormArray(): FormGroup[] {
    return (this.form.get('results') as FormArray).controls as FormGroup[];
  }
}