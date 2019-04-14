import { Component, OnInit } from '@angular/core';
import { ProjectManagerService } from '../project-manager-service.service'
import { IUser } from '../Model/User'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

    allUsers: IUser[];    
    private currentUser: IUser;
    _userFilter: string;
    filteredUsers: IUser[];
    id: string;
    addEditButtonText: string;
    successMessage: string;
    errorMessage: string;
    

    get userFilter(): string
    {
        return this._userFilter;
    }

    set userFilter(value: string)
    {
        this._userFilter = value;
        this.filteredUsers = this.userFilter ? this.performFilter(this.userFilter) : this.allUsers;
    }

    constructor(private pmService: ProjectManagerService, private route: ActivatedRoute) {
        route.params.subscribe(params => {
            
            this.id = params.id;            
            this.getCurrentUserDetails();
            
        });
        
                
        this.resetValues();
        this.getAllUsers();

        //this.id = this.route.snapshot.paramMap.get('id');
        
    }

  ngOnInit() {
  }

  resetValues(): void {

      this.successMessage = "";
      this.errorMessage = "";

      this.currentUser = {
          UserId: 0,
          FirstName: "",
          LastName: "",
          EmployeeId: ""
      }; 
      this.addEditButtonText = "Add";
  }


  getAllUsers(): void
  {
      this.pmService.getAllUsers().subscribe(
          userResult => {
              this.allUsers = userResult;
              this.filteredUsers = this.allUsers;
              this.getCurrentUserDetails();
          },
          errorMsg => this.errorMessage = <any>errorMsg
      );
  }

  getCurrentUserDetails(): void {

      this.addEditButtonText = "Add";
      
      if (this.id && this.filteredUsers)
      {
          this.currentUser = Object.assign({}, this.filteredUsers.find(x => x.UserId.toString() == this.id));
          this.addEditButtonText = "Update";
      }
  }

  validateUserInputs(): boolean {
      if (this.currentUser.FirstName.trim() == "" || this.currentUser.LastName.trim() == "" || this.currentUser.EmployeeId.trim() == "") {
          this.errorMessage = "All fields are mandatory. Please enter valid values to proceed. ";
          return false;
      }

      return true;
  }

  createOrUpdateUser(): void {
      if (this.validateUserInputs()) {

          if (this.addEditButtonText == "Add") {
              this.createUser();
          }
          else {
              this.updateUser();
          }
      }
  }

  createUser(): void {
      this.pmService.createUser(this.currentUser).subscribe(() => { this.getAllUsers(); this.resetValues(); this.successMessage = "User created successfully"; }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  updateUser(): void {
      this.currentUser.UserId = +this.id;
      this.pmService.updateUser(this.currentUser).subscribe(() => { this.getAllUsers(); this.successMessage = "User updated successfully"; }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  deleteUser(): void {
      this.pmService.deleteUser(this.id).subscribe(() => { this.getAllUsers(); this.resetValues(); this.successMessage = "User deleted successfully"; }, errorMsg => this.errorMessage = <any>errorMsg);
  }

  performFilter(filterString: string): IUser[]
  {
      filterString = filterString.toLocaleLowerCase();
      return this.allUsers.filter((user: IUser) => user.FirstName.toLocaleLowerCase().indexOf(filterString) != -1);
  }

  sortByFirstname(): void {
      this.filteredUsers = this.filteredUsers.sort((a: IUser, b: IUser) => {
          if (a.FirstName > b.FirstName) return 1; else if (a.FirstName < b.FirstName) return -1; else return 0;
      });
  }

  sortByLastname(): void {
      this.filteredUsers = this.filteredUsers.sort((a: IUser, b: IUser) => {
          if (a.LastName > b.LastName) return 1; else if (a.LastName < b.LastName) return -1; else return 0;
      });
  }

  sortById(): void {
      this.filteredUsers = this.filteredUsers.sort((a: IUser, b: IUser) => {
          if (a.EmployeeId > b.EmployeeId) return 1; else if (a.EmployeeId < b.EmployeeId) return -1; else return 0;
      });
  }

}
