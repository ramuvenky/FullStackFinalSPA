import { Component, OnInit } from '@angular/core';
import { IProject } from '../Model/Project';
import { IUser } from '../Model/User';
import { ProjectManagerService } from '../project-manager-service.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

    allUsers: IUser[];
    filteredUsers: IUser[];
    allProjects: IProject[];
    successMessage: string;
    errorMessage: string;
    private currentProject: IProject;
    _userFilter: string;
    _projectFilter: string;
    filteredProjects: IProject[];
    id: string;
    addEditButtonText: string;
    setDatesChecked: boolean;

    get userFilter(): string {
        return this._userFilter;
    }

    set userFilter(value: string) {
        this._userFilter = value;
        this.filteredUsers = this.userFilter ? this.performFilter(this.userFilter, "user") : this.allUsers;
    }

    get projectFilter(): string {
        return this._projectFilter;
    }

    set projectFilter(value: string) {
        this._projectFilter = value;
        this.filteredProjects = this.projectFilter ? this.performFilter(this.projectFilter, "project") : this.allProjects;
    }

    constructor(private pmService: ProjectManagerService, private route: ActivatedRoute) {
        route.params.subscribe(params => {

            this.id = params.id;
            this.getCurrentProjectDetails();

        });
        //this.id = this.route.snapshot.paramMap.get('id');

        this.resetValues();
        this.getAllUsers();        
        this.getAllProjects();
    }

  ngOnInit() {
  }

  changeEvent(event) {
      this.setDatesChecked = false;
      var target = event.target;

      if (target.checked) {
          this.setDatesChecked = true;
      }
  }

  resetValues(): void {
      this.successMessage = "";
      this.errorMessage = "";

      this.currentProject = {
          TotalTasks: 0,
          TotalCompleted:0,
          ProjectId: 0,
          Project_Name: "",
          StartDate: "",
          EndDate: "",
          Priority: 0,
          UserId: 0,
          Username: ""
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
              this.formatDates();
              this.getCurrentProjectDetails();
          },
          errorMsg => this.errorMessage = <any>errorMsg
      );
  }

  formatDates(): void {
      for (let project of this.filteredProjects) {
          if (project.StartDate != null) {
              project.StartDate = project.StartDate.toString().substring(0, 10);
          }

          if (project.EndDate != null) {
              project.EndDate = project.EndDate.toString().substring(0, 10);
          }
      }
  }

  selectCurrentUserDetails(event): void {
      
      var target = event.target || event.srcElement || event.currentTarget;      
      var userIdValue = target.value;
      

      if (userIdValue && this.filteredUsers) {
          this.currentProject.UserId = userIdValue;
          this.currentProject.Username = this.filteredUsers.find(x => x.UserId.toString() == userIdValue).FirstName;          
      }
  }

  getCurrentProjectDetails(): void {
      this.addEditButtonText = "Add";

      if (this.id && this.filteredProjects) {
          this.currentProject = Object.assign({}, this.filteredProjects.find(x => x.ProjectId.toString() == this.id));
          this.addEditButtonText = "Update";
      }
  }

  validateUserInputs(): boolean {      
      if (this.currentProject.Project_Name.trim() == "" || this.currentProject.Username.trim() == "") {
          this.errorMessage = "Project name and Manager are mandatory fields. Please enter valid values to proceed."
          return false;
      }

      return true;
  }

  createOrUpdateProject(): void {
      if (this.validateUserInputs()) {
          if (this.addEditButtonText == "Add") {
              this.createProject();
          }
          else {
              this.updateProject();
          }
      }
  }

  createProject(): void {      
      this.pmService.createProject(this.currentProject).subscribe(() => { this.getAllProjects(); this.resetValues(); this.successMessage = "Project created successfully!"; }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  updateProject(): void {
      this.currentProject.ProjectId = +this.id;
      this.pmService.updateProject(this.currentProject).subscribe(() => { this.getAllProjects(); this.errorMessage = ""; this.successMessage = "Project details updated successfully!"; }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  performFilter(filterString: string, filterObject:string): any[] {
      filterString = filterString.toLocaleLowerCase();

      if (filterObject == "project") {
          return this.allProjects.filter((project: IProject) => project.Project_Name.toLocaleLowerCase().indexOf(filterString) != -1);
      }
      else if (filterObject == "user") {
          return this.allUsers.filter((user: IUser) => user.FirstName.toLocaleLowerCase().indexOf(filterString) != -1);
      }
  }

  sortByStartDate(): void {
      this.filteredProjects = this.filteredProjects.sort((a: IProject, b: IProject) => {
          if ((a.StartDate != null && b.StartDate != null) && new Date(a.StartDate) > new Date(b.StartDate)) return 1; else if ((a.StartDate != null && b.StartDate != null) && new Date(a.StartDate) < new Date(b.StartDate)) return -1; else return 0;
      });
  }

  sortByEndDate(): void {
      this.filteredProjects = this.filteredProjects.sort((a: IProject, b: IProject) => {
          if ((a.EndDate != null && b.EndDate != null) && new Date(a.EndDate) > new Date(b.EndDate)) return 1; else if ((a.EndDate != null && b.EndDate != null) && new Date(a.EndDate) < new Date(b.EndDate)) return -1; else return 0;
      });
  }

  sortByPriority(): void {
      this.filteredProjects = this.filteredProjects.sort((a: IProject, b: IProject) => {
          if (a.Priority > b.Priority) return 1; else if (a.Priority < b.Priority) return -1; else return 0;
      });
  }
}
