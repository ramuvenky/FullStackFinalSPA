import { Component, OnInit } from '@angular/core';
import { IProject } from '../Model/Project';
import { IUser } from '../Model/User';
import { ITask } from '../Model/Task';
import { IParentTask } from '../Model/ParentTask';
import { ProjectManagerService } from '../project-manager-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

    allParentTasks: IParentTask[];
    filteredParentTasks: IParentTask[];
    allUsers: IUser[];
    filteredUsers: IUser[];
    allProjects: IProject[];
    filteredProjects: IProject[];
    _userFilter: string;
    _projectFilter: string;
    _parentTaskFilter: string;
    private currentTask: ITask;
    id: string;
    addEditButtonText: string;
    errorMessage: string;
    parentTaskChecked: boolean;

    get userFilter(): string {
        return this._userFilter;
    }

    set userFilter(value: string) {
        this._userFilter = value;
        this.filteredUsers = this.userFilter ? this.performFilter(this.userFilter,"user") : this.allUsers;
    }

    get projectFilter(): string {
        return this._projectFilter;
    }

    set projectFilter(value: string) {
        this._projectFilter = value;
        this.filteredProjects = this.projectFilter ? this.performFilter(this.projectFilter,"project") : this.allProjects;
    }

    get parentTaskFilter(): string {
        return this._parentTaskFilter;
    }

    set parentTaskFilter(value: string) {
        this.parentTaskFilter = value;
        this.filteredParentTasks = this.parentTaskFilter ? this.performFilter(this.parentTaskFilter,"parentTask") : this.allParentTasks;
    }

    constructor(private pmService: ProjectManagerService, private route: ActivatedRoute) {
        route.params.subscribe(params => {
                        
            this.id = params.id;
            this.getCurrentTaskDetails();

        });

        
        this.parentTaskChecked = false;
        this.resetValues();
        this.getAllUsers();
        this.getAllProjects();
        this.getAllParentTasks();
    }

    ngOnInit() {
        
  }

  resetValues(): void {
      this.currentTask = {
          TaskId: 0,
          ParentTaskId: 0,
          Parent_task: "",
          ProjectId: 0,
          Project_Name: "",
          Task_Name: "",
          Start_Date: "",
          End_date: "",
          Priority: 0,
          Status: "",
          UserId: 0,
          User_name: ""
      };
      this.addEditButtonText = "Add";
  }

  getAllUsers(): void {
      this.pmService.getAllUsers().subscribe(
          userResult => {
              this.allUsers = userResult;
              this.filteredUsers = this.allUsers;
          },
          errorMsg => this.errorMessage = <any>errorMsg
      );
  }

  getAllProjects(): void {
      this.pmService.getAllProjects().subscribe(
          projectResult => {
              this.allProjects = projectResult;
              this.filteredProjects = this.allProjects;
          },
          errorMsg => this.errorMessage = <any>errorMsg
      );
  }

  getAllParentTasks(): void {
      this.pmService.getAllParentTasks().subscribe(
          parentTaskResult => {
              this.allParentTasks = parentTaskResult;
              this.filteredParentTasks = this.allParentTasks;
          },
          errorMsg => this.errorMessage = <any>errorMsg
      );
  }

  formatDates(): void {
      this.currentTask.Start_Date = this.currentTask.Start_Date.substring(0, 10);
      this.currentTask.End_date = this.currentTask.End_date.substring(0, 10);
  }

  changeEvent(event) {
      this.parentTaskChecked = false;
      var target = event.target;

      if (target.checked) {
          this.parentTaskChecked = true;
      }
  }

  selectCurrentUserDetails(event): void {

      var target = event.target || event.srcElement || event.currentTarget;
      var userIdValue = target.value;


      if (userIdValue && this.filteredUsers) {
          this.currentTask.UserId = userIdValue;
          this.currentTask.User_name = this.filteredUsers.find(x => x.UserId.toString() == userIdValue).FirstName;
      }
  }

  selectCurrentProjectDetails(event): void {

      var target = event.target || event.srcElement || event.currentTarget;
      var projectIdValue = target.value;


      if (projectIdValue && this.filteredProjects) {
          this.currentTask.ProjectId = projectIdValue;
          this.currentTask.Project_Name = this.filteredProjects.find(x => x.ProjectId.toString() == projectIdValue).Project_Name;
      }
  }

  selectCurrentParentTaskDetails(event): void {

      var target = event.target || event.srcElement || event.currentTarget;
      var parentTaskIdValue = target.value;


      if (parentTaskIdValue && this.filteredProjects) {
          this.currentTask.ParentTaskId = parentTaskIdValue;
          this.currentTask.Parent_task = this.filteredParentTasks.find(x => x.ParentTaskId.toString() == parentTaskIdValue).Parent_Task;
      }
  }

  getCurrentTaskDetails(): void {
      if (this.id != undefined) {
          this.pmService.getTask(this.id).subscribe((taskResult) => { this.currentTask = taskResult; this.formatDates() }, errorMsg => this.errorMessage = <any>errorMsg);
          this.addEditButtonText = "Update";
      }
  }

  createOrUpdateTask(): void {

      if (this.parentTaskChecked) {
          this.createParentTask();
      }
      else if (this.addEditButtonText == "Add") {
          this.createTask();
      }
      else {
          this.updateTask();
      }
  }

  createParentTask(): void {

      let parentTask: IParentTask = {
          ParentTaskId: 0,
          Parent_Task: this.currentTask.Task_Name
      };      

      this.pmService.createParentTask(parentTask).subscribe(() => { this.getAllParentTasks(); this.resetValues(); }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  createTask(): void {
      this.pmService.createTask(this.currentTask).subscribe(() => { this.resetValues(); }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  updateTask(): void {
      this.currentTask.TaskId = +this.id;
      this.pmService.updateTask(this.currentTask).subscribe(() => { }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  performFilter(filterString: string, filterObject: string): any[] {
      filterString = filterString.toLocaleLowerCase();

      if (filterObject == "project") {
          return this.allProjects.filter((project: IProject) => project.Project_Name.toLocaleLowerCase().indexOf(filterString) != -1);
      }
      else if (filterObject == "user") {
          return this.allUsers.filter((user: IUser) => user.FirstName.toLocaleLowerCase().indexOf(filterString) != -1);
      }
      else if (filterObject == "parentTask") {
          return this.allParentTasks.filter((parentTask: IParentTask) => parentTask.Parent_Task.toLocaleLowerCase().indexOf(filterString) != -1);
      }
  }
}
