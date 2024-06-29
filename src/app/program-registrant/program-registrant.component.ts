import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { Registrant } from '../interface/registrant';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Component({
  selector: 'app-program-registrant',
  templateUrl: './program-registrant.component.html',
  styleUrls: ['./program-registrant.component.scss']
})
export class ProgramRegistrantComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'fullName', 'matricNo', 'email', 'telNo', 'registeredDate'];
  dataSource = new MatTableDataSource<Registrant>();
  userId: number = 0;
  programId: number = 0;
  program: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('registrantTable') registrantTable!: ElementRef;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private programService: ProgramService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    //Accessing the id parameter from route parameters
    this.route.params.subscribe(params => {
      this.programId = +params['programId']; // '+' is used to convert string to number
      this.ngxService.start();
      this.getProgramById(this.programId);
      this.getRegistrantList(this.programId);
    });
    
  }

  getProgramById(programId: number) {
    this.programService.getProgramById(programId).subscribe((result: any) => {
        this.ngxService.stop();
        this.program = result;
        this.program.image = `${environment.apiUrl}/${this.program.image}`;

        this.userId = this.program.userId;
        const token = localStorage.getItem('token');
        const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
        const userId = decodedToken?.userId;
        if (this.userId && this.userId !== userId) {
          // console.log("Created by in if:", this.userId);
          this.router.navigate(['/forbidden']);
        }
        // console.log(this.program.image);
        // console.log(result);
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  getRegistrantList(programId: number) {
    this.programService.getRegistrantList(programId).subscribe((result: Registrant[]) => {
        this.ngxService.stop();
        // console.log(result);
        this.dataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
        // console.log(this.dataSource.data);
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  downloadPDF() {
    const DATA = document.getElementById('registrantTable');
    const padding = 10; // Padding in mm
    if (DATA) {
      html2canvas(DATA).then(canvas => {
        const fileWidth = 210 - padding * 2; // A4 width in mm minus padding
        const fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
  
        // Add program title 
        const startY = padding;
        const lineHeight = 6;
        PDF.setFontSize(14); 
        PDF.text(`${this.program?.programTitle}`, padding, startY + lineHeight);
  
        // Add program details
        const programDetailsY = startY + lineHeight + 8;
        PDF.setFontSize(11);
        PDF.text(`Date      : ${new Date(this.program.startDate).toLocaleDateString()} – ${new Date(this.program.endDate).toLocaleDateString()}`, padding, programDetailsY);
        PDF.text(`Time      : ${this.program.startTime} – ${this.program.endTime}`, padding, programDetailsY + lineHeight);
        PDF.text(`Location : ${this.program.location}`, padding, programDetailsY + lineHeight * 2);
  
        // Adding the "Registrant List" text above the table image
        const registrantListY = programDetailsY + lineHeight * 3 + 10;
        PDF.setFontSize(14);
        PDF.text('Registrant List', padding, registrantListY);
  
        // Adding the Table Image
        PDF.addImage(FILEURI, 'PNG', padding, registrantListY + 5, fileWidth, fileHeight);
  
        // Footer with local date and time
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        PDF.setFontSize(10);
        PDF.text(`Generated on ${currentTime} ${currentDate} from CampusConnect`, padding, 295);
  
        PDF.save(`${this.program.programTitle}_registrants.pdf`);
      });
    }
  }
}