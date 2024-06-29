import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersakaService } from '../services/persaka.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-update-persaka',
  templateUrl: './update-persaka.component.html',
  styleUrls: ['./update-persaka.component.scss']
})
export class UpdatePersakaComponent implements OnInit{
  persakaForm: any = FormGroup;
  responseMessage: any;
  image: any;
  imagePath: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private persakaService: PersakaService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.persakaForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: [''],
      description: ['', Validators.required]
    });

    this.getContent();
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
      this.imagePath = `${environment.apiUrl}/${this.image}`;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imagePath = event.target.result;
      }
    }
  }

  getContent() {
    this.ngxService.start();
    this.persakaService.getPersakaContent().subscribe((persaka: any) => {
      this.persakaForm.patchValue({
        title: persaka[0].title,
        description: persaka[0].description,
      });
      this.image = persaka[0].image;
      this.imagePath = `${environment.apiUrl}/${this.image}`;
      this.ngxService.stop();
      // console.log(persaka);
    },
      error => {
        console.error('Error loading PERSAKA details:', error);
        this.ngxService.stop();
      }
    );
  }

  updatePersaka() {
    this.ngxService.start();

    const formData = new FormData();
    formData.append('title', this.persakaForm.get('title').value);
    formData.append('image', this.image);
    formData.append('description', this.persakaForm.get('description').value);

    formData.forEach((value, key) => {
      // console.log(`${key}:`, value);
    });

    this.persakaService.updatePersaka(formData).subscribe(() => {
      this.ngxService.stop();
      this.router.navigate(['/persaka']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage);
    });
  }
}
