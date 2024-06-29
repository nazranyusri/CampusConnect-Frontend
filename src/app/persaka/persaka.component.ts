import { Component, OnInit } from '@angular/core';
import { PersakaService } from '../services/persaka.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-persaka',
  templateUrl: './persaka.component.html',
  styleUrls: ['./persaka.component.scss']
})
export class PersakaComponent implements OnInit {
  persaka: Array<any> = [];
  isAuthorized: boolean = false;

  constructor(
    private persakaService: PersakaService,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.getPersaka();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtDecode.decodeToken(token);
      const role = decodedToken?.role || '';
      if (decodedToken) {
        if (role === 'admin') {
          this.isAuthorized = true;
        }
      }
    }
  }

  getPersaka() {
    this.persakaService.getPersakaContent().subscribe((result: any) => {
      this.ngxService.stop();
      this.persaka = result.map((persaka: any) => {
        persaka.image = `${environment.apiUrl}/${persaka.image}`;
        return persaka;
      });
      // console.log(this.persaka);
      return result;
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }
}
