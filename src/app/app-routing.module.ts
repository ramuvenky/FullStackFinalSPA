import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';

const routes: Routes = [
    { path: 'AddProject/:id', component: AddProjectComponent },
    { path: 'AddProject', component: AddProjectComponent },
    { path: 'AddUser/:id', component: AddUserComponent },
    { path: 'AddUser', component: AddUserComponent },
    { path: 'AddTask/:id', component: AddTaskComponent },
    { path: 'AddTask', component: AddTaskComponent },
    { path: 'ViewTask', component: ViewTaskComponent },
    { path: '', redirectTo: 'AddUser', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
