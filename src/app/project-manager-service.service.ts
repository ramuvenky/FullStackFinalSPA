import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IUser } from './Model/User';
import { IProject } from './Model/Project';
import { IParentTask } from './Model/ParentTask';
import { ITask } from './Model/Task';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {

    private userURL = 'http://localhost:50328/api/user/';
    
    private projectURL = 'http://localhost:50328/api/project/';
    private taskURL = 'http://localhost:50328/api/task/';
    private parentTaskURL = 'http://localhost:50328/api/ParentTask/';

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<IUser[]>
    {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'                
            });
        return this.http.get<IUser[]>(this.userURL).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    createUser(user: IUser): Observable<IUser>
    {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.post<IUser>(this.userURL, user, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    updateUser(user: IUser): Observable<IUser> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.put<IUser>(this.userURL + user.UserId.toString(), user, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    deleteUser(id: string): Observable<IUser> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.delete<IUser>(this.userURL + id, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    getAllProjects(): Observable<IProject[]> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.get<IProject[]>(this.projectURL).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    createProject(project: IProject): Observable<IProject> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.post<IProject>(this.projectURL, project, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    updateProject(project: IProject): Observable<IProject> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.put<IProject>(this.projectURL + project.ProjectId.toString(), project, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    getAllTasks(): Observable<ITask[]> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.get<ITask[]>(this.taskURL).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    getTask(id: string): Observable<ITask> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.get<ITask>(this.taskURL + id).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    createTask(task: ITask): Observable<ITask> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });        
        return this.http.post<ITask>(this.taskURL, task, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    updateTask(task: ITask): Observable<ITask> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.put<ITask>(this.taskURL + task.TaskId.toString(), task, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    getAllParentTasks(): Observable<IParentTask[]> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.get<IParentTask[]>(this.parentTaskURL).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    createParentTask(parentTask: IParentTask): Observable<IParentTask> {
        let httpHeaders: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'my-token'
            });
        return this.http.post<IParentTask>(this.parentTaskURL, parentTask, { headers: httpHeaders }).pipe(tap(data => { console.log(JSON.stringify(data)); }), catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    } 
}
