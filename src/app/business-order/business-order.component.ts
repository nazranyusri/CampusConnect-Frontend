import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { BusinessService } from '../services/business.service';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-business-order',
  templateUrl: './business-order.component.html',
  styleUrls: ['./business-order.component.scss']
})
export class BusinessOrderComponent implements OnInit{
  displayedColumns: string[] = ['position', 'fullName', 'telNo', 'address', 'details', 'status', 'datePurchased', 'action'];
  dataSource = new MatTableDataSource<any>();
  businessId: number = 0;
  business: any;
  menuItems: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('orderTable') orderTable!: ElementRef;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    //Accessing the id parameter from route parameters
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.ngxService.start();
      // console.log(this.id);
      this.getBusinessById(this.businessId);
      this.getMenuItems(this.businessId);
      this.getBusinessOrderList(this.businessId);
    });
  }

  getBusinessById(businessId: number) {
    this.businessService.getBusinessById(businessId).subscribe((result: any) => {
      this.ngxService.stop();
      this.business = result;
      this.business.image = `${environment.apiUrl}/${this.business.image}`;
    },
    (error: any) => {
      this.ngxService.stop();
      console.error(error);
    });
  }

  getMenuItems(businessId: number) {
    this.businessService.getMenuItems(businessId).subscribe((result: any) => {
      this.ngxService.stop();
      this.menuItems = result;
      // console.log(result);
    },
    (error: any) => {
      this.ngxService.stop();
      console.error(error);
    });
  }

  downloadPDF() {
    const DATA = document.getElementById('orderTable');
    const padding = 10; // Padding in mm
    if (DATA) {
      html2canvas(DATA).then(canvas => {
        const fileWidth = 210 - padding * 2; // A4 width in mm minus padding
        const fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
  
        // Add business title 
        const startY = padding;
        const lineHeight = 6;
        PDF.setFontSize(14); 
        PDF.text(`${this.business?.businessTitle}`, padding, startY + lineHeight);
  
        // Add business details
        const businessDetailsY = startY + lineHeight + 8;
        PDF.setFontSize(11);
        PDF.text(`Name          : ${this.business.telName}`, padding, businessDetailsY);
        PDF.text(`Telephone no. : ${this.business.telNo}`, padding, businessDetailsY + lineHeight);
  
        // Adding the "Order List" text above the table image
        const orderListY = businessDetailsY + lineHeight * 3 + 10;
        PDF.setFontSize(14);
        PDF.text('Order List', padding, orderListY);
  
        // Adding the Table Image
        PDF.addImage(FILEURI, 'PNG', padding, orderListY + 5, fileWidth, fileHeight);
  
        // Footer with local date and time
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        PDF.setFontSize(10);
        PDF.text(`Generated on ${currentTime} ${currentDate} from CampusConnect`, padding, 295);
  
        PDF.save(`${this.business.businessTitle}_OrderList.pdf`);
      });
    }
  }

  getBusinessOrderList(businessId: number) {
    this.businessService.getBusinessOrderList(businessId).subscribe((result: any[]) => {
      this.ngxService.stop();
      console.log(result);
      this.dataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
      console.log(this.dataSource.data);
    },
    (error: any) => {
      this.ngxService.stop();
      console.error(error);
    });
  }

  updateOrderStatus(orderId: number, status: string) {
    console.log(orderId, status);
    this.businessService.updateOrderStatus(orderId, status).subscribe((result:any) => {
      this.snackbarService.openSnackBar(result.message);
      this.dataSource.data = this.dataSource.data.filter(order => order.status !== 'paid');
      this.getBusinessOrderList(this.businessId);
    },
    (error: any) => {
      this.ngxService.stop();
      this.snackbarService.openSnackBar(error.message);
    });
  }
}
