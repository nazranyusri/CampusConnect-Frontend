import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProgramComponent } from './program/program.component';
import { BusinessComponent } from './business/business.component';
import { SurveyComponent } from './survey/survey.component';
import { PersakaComponent } from './persaka/persaka.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DetailedProgramComponent } from './detailed-program/detailed-program.component';
import { WildcardComponent } from './wildcard/wildcard.component';
import { RouterGuardService } from './services/router-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { UpdateProgramComponent } from './update-program/update-program.component';
import { ProgramRegistrantComponent } from './program-registrant/program-registrant.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { UpdateBusinessComponent } from './update-business/update-business.component';
import { ClubadminGuardService } from './services/clubadmin-guard.service';
import { AddSurveyComponent } from './add-survey/add-survey.component';
import { UpdateSurveyComponent } from './update-survey/update-survey.component';
import { DetailedSurveyComponent } from './detailed-survey/detailed-survey.component';
import { DetailedBusinessComponent } from './detailed-business/detailed-business.component';
import { UpdatePersakaComponent } from './update-persaka/update-persaka.component';
import { AdminGuardService } from './services/admin-guard.service';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { RegisterClubComponent } from './register-club/register-club.component';
import { ManageComponent } from './manage/manage.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BusinessOrderComponent } from './business-order/business-order.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},

  // ADMIN ROUTES
  {
    path: 'manage', component: ManageComponent,
    canActivate: [RouterGuardService, AdminGuardService]
  },

  // USER ROUTES
  {path: 'homepage', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'registerclub', component: RegisterClubComponent},
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [RouterGuardService]
  },
  {
    path: 'updateprofile/:userId', component: UpdateProfileComponent,
    canActivate: [RouterGuardService]
  },

  // PROGRAM ROUTES
  {path: 'program', component: ProgramComponent},
  {path: 'detailedprogram/:programId', component: DetailedProgramComponent},
  {
    path: 'addprogram', component: AddProgramComponent,
    canActivate: [RouterGuardService, ClubadminGuardService]
  },
  {
    path: 'updateprogram/:id', component: UpdateProgramComponent,
    canActivate: [RouterGuardService, ClubadminGuardService]
  },
  {
    path: 'programregistrant/:programId', component: ProgramRegistrantComponent,
    canActivate: [RouterGuardService, ClubadminGuardService]
  },
  
  // BUSINESS ROUTES
  {path: 'business', component: BusinessComponent},
  {path: 'detailedbusiness/:businessId', component: DetailedBusinessComponent},
  {
    path: 'checkout/:businessId', component: CheckoutComponent,
    canActivate: [RouterGuardService]
  },
  {
    path: 'businessorder/:businessId', component: BusinessOrderComponent,
    canActivate: [RouterGuardService]
  },
  {
    path: 'addbusiness', component: AddBusinessComponent,
    canActivate: [RouterGuardService]
  },
  {
    path: 'updatebusiness/:businessId', component: UpdateBusinessComponent,
    canActivate: [RouterGuardService]
  },

  //SURVEY ROUTES
  {path: 'survey', component: SurveyComponent},
  {path: 'detailedsurvey/:surveyId', component: DetailedSurveyComponent},
  {
    path: 'addsurvey', component: AddSurveyComponent,
    canActivate: [RouterGuardService]
  },
  {
    path: 'updatesurvey/:surveyId', component: UpdateSurveyComponent,
    canActivate: [RouterGuardService]
  },

  //PERSAKA ROUTES
  {path: 'persaka', component: PersakaComponent},
  {
    path: 'updatepersaka', component: UpdatePersakaComponent,
    canActivate: [RouterGuardService, AdminGuardService]
  },

  {path: '**', component: WildcardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
