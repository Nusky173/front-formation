import { ApplicationConfig, NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { UserComponent } from './component/user/user.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TagComponent } from './component/tag/tag.component';
import { MessageComponent } from './component/message/message.component';

const routes: Routes = [
  {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: "user", component: UserComponent},
  {path: "message", component: MessageComponent},
  {path: "tag", component: TagComponent},
];

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()), provideRouter(routes), provideClientHydration()]
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
