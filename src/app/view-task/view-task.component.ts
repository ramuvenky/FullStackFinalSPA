import { Component, OnInit } from '@angular/core';
import { IProject } from '../Model/Project';
import { ITask } from '../Model/Task';
import { ProjectManagerService } from '../project-manager-service.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

    allTasks: ITask[];
    errorMessage: string;
    allProjects: IProject[];
    filteredProjects: IProject[];
    _projectFilter: string;
    project_Name: string;
    projectId: string;

    get projectFilter(): string {
        return this._projectFilter;
    }

    set projectFilter(value: string) {
        this._projectFilter = value;
        this.filteredProjects = this.projectFilter ? this.performFilter(this.projectFilter, "project") : this.allProjects;
    }

    constructor(private pmService: ProjectManagerService) {
        this.getAllProjects();
    }

  ngOnInit() {
  }

  getAllTasks(): void {
      this.pmService.getAllTasks().subscribe(
          taskResult => {
              this.allTasks = taskResult;
              this.allTasks = this.performFilter(this.projectId, "task");
              this.updateTaskName();
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

  selectCurrentProjectDetails(event): void {

      var target = event.target || event.srcElement || event.currentTarget;
      var projectIdValue = target.value;


      if (projectIdValue && this.filteredProjects) {
          this.projectId = projectIdValue;
          this.project_Name = this.filteredProjects.find(x => x.ProjectId.toString() == projectIdValue).Project_Name;
          this.getAllTasks();
      }
  }

  performFilter(filterString: string, filterObject: string): any[] {

      filterString = filterString.toLocaleLowerCase();

      if (filterObject == "project") {          
          return this.allProjects.filter((project: IProject) => project.Project_Name.toLocaleLowerCase().indexOf(filterString) != -1);
      }
      else
      {
          return this.allTasks.filter((task: ITask) => task.ProjectId.toString().indexOf(filterString) != -1);
      }
  }

  updateTaskName(): void {
      let index: number = 1;

      for (let task of this.allTasks) {
          task.Task_Name = "Task " + index.toString();
          index += 1;
          if (task.Parent_task == null || task.Parent_task == "") {
              task.Parent_task = "This Task has NO Parent";
          }
      }
  }

  EndTask(event) {
      var target = event.target;
      var taskIdValue = target.value;

      let currentTask: ITask = Object.assign({}, this.allTasks.find(x => x.TaskId.toString() == taskIdValue));
      currentTask.Status = "Completed";
      this.pmService.updateTask(currentTask).subscribe(() => { }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  sortByStartDate(): void {
      this.allTasks = this.allTasks.sort((a: ITask, b: ITask) => {
          if (new Date(a.Start_Date) > new Date(b.Start_Date)) return 1; else if (new Date(a.Start_Date) < new Date(b.Start_Date)) return -1; else return 0;
      });
  }

  sortByEndDate(): void {
      this.allTasks = this.allTasks.sort((a: ITask, b: ITask) => {
          if (new Date(a.End_date) > new Date(b.End_date)) return 1; else if (new Date(a.End_date) < new Date(b.End_date)) return -1; else return 0;
      });
  }

  sortByPriority(): void {
      this.allTasks = this.allTasks.sort((a: ITask, b: ITask) => {
          if (a.Priority > b.Priority) return 1; else if (a.Priority < b.Priority) return -1; else return 0;
      });
  }

}
