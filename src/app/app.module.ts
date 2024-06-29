import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './shared/material-module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { ProgramComponent } from './program/program.component';
import { BusinessComponent } from './business/business.component';
import { SurveyComponent } from './survey/survey.component';
import { PersakaComponent } from './persaka/persaka.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { DetailedProgramComponent } from './detailed-program/detailed-program.component';
import { WildcardComponent } from './wildcard/wildcard.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TruncatePipe } from './pipe/truncate.pipe';
import { UpdateProgramComponent } from './update-program/update-program.component';
import { ProgramRegistrantComponent } from './program-registrant/program-registrant.component';
import { ProgramQueryPipe } from './pipe/program-query.pipe';
import { BusinessQueryPipe } from './pipe/business-query.pipe';
import { AddBusinessComponent } from './add-business/add-business.component';
import { UpdateBusinessComponent } from './update-business/update-business.component';
import { SurveyQueryPipe } from './pipe/survey-query.pipe';
import { AddSurveyComponent } from './add-survey/add-survey.component';
import { DetailedSurveyComponent } from './detailed-survey/detailed-survey.component';
import { UpdateSurveyComponent } from './update-survey/update-survey.component';
import { DetailedBusinessComponent } from './detailed-business/detailed-business.component';
import { TokenInterceptor } from './services/token.interceptor';
import { UpdatePersakaComponent } from './update-persaka/update-persaka.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { RegisterClubComponent } from './register-club/register-club.component';
import { ManageComponent } from './manage/manage.component';
import { UserQueryPipe } from './pipe/user-query.pipe';
import { PostQueryPipe } from './pipe/post-query.pipe';
import { ClubQueryPipe } from './pipe/club-query.pipe';
import { CheckoutComponent } from './checkout/checkout.component';
import { BusinessOrderComponent } from './business-order/business-order.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading...',
  textColor: 'white',
  textPosition: 'center-center',
  bgsColor: 'white',
  fgsColor: 'white',
  fgsType: SPINNER.chasingDots,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    NavBarComponent,
    FooterComponent,
    ProgramComponent,
    BusinessComponent,
    SurveyComponent,
    PersakaComponent,
    ProfileComponent,
    RegisterComponent,
    DetailedProgramComponent,
    WildcardComponent,
    AddProgramComponent,
    ConfirmationDialogComponent,
    TruncatePipe,
    UpdateProgramComponent,
    ProgramRegistrantComponent,
    ProgramQueryPipe,
    BusinessQueryPipe,
    AddBusinessComponent,
    UpdateBusinessComponent,
    SurveyQueryPipe,
    AddSurveyComponent,
    DetailedSurveyComponent,
    UpdateSurveyComponent,
    DetailedBusinessComponent,
    UpdatePersakaComponent,
    UpdateProfileComponent,
    RegisterClubComponent,
    ManageComponent,
    UserQueryPipe,
    PostQueryPipe,
    ClubQueryPipe,
    CheckoutComponent,
    BusinessOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [
    HttpClientModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-MY' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }