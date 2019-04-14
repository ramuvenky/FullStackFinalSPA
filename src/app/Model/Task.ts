export interface ITask {
    TaskId: number,
    ParentTaskId: number,
    Parent_task: string,
    ProjectId: number,
    Project_Name: string,
    Task_Name: string,
    Start_Date: string,
    End_date: string,
    Priority: number,
    Status: string,
    UserId: number,
    User_name: string
}