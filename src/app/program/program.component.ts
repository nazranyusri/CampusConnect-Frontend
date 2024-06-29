import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit{
  searchKey: string = '';
  programs: Array<any> = [];
  isAuthorized: boolean = false;
  isFilter: boolean = false;
  filterCategory: string = '';
  defaultAvatar: string = '../../assets/resources/defaultAvatar.png';
  
  constructor(
    private programService: ProgramService,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService
  ){}

  ngOnInit(){
    this.ngxService.start();
    this.getAllProgram();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtDecode.decodeToken(token);
      const role = decodedToken?.role || '';
      if (role === 'club') {
        this.isAuthorized = true;
      } else if (role === 'admin') {
        this.isAuthorized = true;
      }
    }
  }

  toggleFilterContainer(){
    this.isFilter = !this.isFilter;
  }

  toggleButton(buttonName: string) {
    if (this.filterCategory === buttonName) {
      this.filterCategory = ''; 
    } else {
      this.filterCategory = buttonName;
    }
  }

  getAllProgram(){
    this.programService.getAllProgram().subscribe((result: any) => {
        this.ngxService.stop();
        this.programs = result.map((program: any) => {
          program.image = `${environment.apiUrl}/${program.image}`;
          if(program.profileImage){
            program.profileImage = `${environment.apiUrl}/${program.profileImage}`;
          }
          return program;
        });
        // console.log(this.programs);
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }
}
