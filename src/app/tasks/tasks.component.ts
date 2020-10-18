import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  isLoading: boolean = false;
  isModalActive: boolean = false;
  mode: string = '';
  currentTask: Task;
  // Subscription handler - used for preventing memory leaks
  tasksSubscription: Subscription;

  constructor(public tasksService: TasksService) { }

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks();
    // Listen for updates to the sermons list
    this.tasksSubscription = this.tasksService.getTasksUpdatedListener()
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.tasksSubscription.unsubscribe;
  }

  onCloseModal() {
    this.isModalActive = false;
    this.mode = '';
  }

  onAddTask() {
    this.mode = 'New';
    this.isModalActive = true;
  }

  onEditTask(task: Task) {
    this.mode = 'Edit';
    this.currentTask = task;
    this.isModalActive = true;    
  }

  onSaveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;

    if (this.mode == 'New') {
      this.tasksService.addTask(form.value.title);
    } else if (this.mode == 'Edit') {
      this.tasksService.updateTask(this.currentTask.id, form.value.title);
    }

    this.mode = '';
    this.currentTask = {
      id: '',
      title: ''
    };
    this.isModalActive = false;
    this.isLoading = false;
  }

  onRemoveTask(task: Task) {
    this.tasksService.removeTask(task.id).subscribe(() => {
      this.tasksService.getTasks();
    }, () => {
      this.isLoading = false;
    });
  }
}
