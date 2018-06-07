import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnInit {
  flightForm: FormGroup;
  id:string = '';
  isbn:string = '';
  title:string = '';
  description:string = '';
  author:string = '';
  publisher:string = '';
  published_year:string = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    //this.getFlight(this.route.snapshot.params['id']);
    this.flightForm = this.formBuilder.group({
      'isbn' : [null, Validators.required],
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
      'author' : [null, Validators.required],
      'publisher' : [null, Validators.required],
      'published_year' : [null, Validators.required]
    });
  }

  /*getFlight(id) {
    this.http.get(id).subscribe(data => {
      this.id = data._id;
      this.flightForm.setValue({
        isbn: data.isbn,
        title: data.title,
        description: data.description,
        author: data.author,
        publisher: data.publisher,
        published_year: data.published_year
      });
    });
  }*/

  onFormSubmit(form:NgForm) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.put('/api/flight-edit', form, httpOptions)
      .subscribe(res => {
          let id = res['_id'];
          this.router.navigate(['/flight-details', id]);
        }, (err) => {
          console.log(err);
        }
      );
  }

  flightDetails() {
    this.router.navigate(['/flight-details', this.id]);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
}
