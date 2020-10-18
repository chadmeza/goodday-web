import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Task } from './task.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasks: Task[] = [];

  // Subject used as an observable
  private updatedTasks = new Subject<Task[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // Allows classes to subscribe to this observable
  getTasksUpdatedListener() {
    return this.updatedTasks.asObservable();
  }

  // Gets a list of all tasks
  getTasks() {
    this.http.get<{ success: boolean, data: any[] }>(`${environment.apiUrl}/tasks`)
      .pipe(map(response => {
        return {
          tasks: response.data.map(task => {
            return {
              id: task._id,
              title: task.title
            };
          })
        };
      }))
      .subscribe(transformedData => {
        this.tasks = transformedData.tasks;
        this.updatedTasks.next([...this.tasks]);
      }, error => {
        this.updatedTasks.next([]);
      });
  }

  // Adds a single event
  addTask(title: string) {
    const task: Task = {
      id: null,
      title: title
    };

    this.http.post(`${environment.apiUrl}/tasks`, task)
      .subscribe(response => {
        this.getTasks();
      });
  }

  updateTask(id: string, title: string) {
    const task: Task = {
      id: id,
      title: title
    };

    this.http.put(`${environment.apiUrl}/tasks/` + id, task)
      .subscribe(response => {
        this.getTasks();
      });
  }

  removeTask(taskId: string) {
    return this.http.delete(`${environment.apiUrl}/tasks/` + taskId);
  }
}
