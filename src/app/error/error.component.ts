import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {
    isActive: boolean = false;
    error: string = '';
    errorStatusSubscription: Subscription;

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorStatusSubscription = this.errorService.getErrorStatusListener().subscribe(response => {
            this.error = response;
            this.isActive = true;
        });
    }

    ngOnDestroy() {
        this.errorStatusSubscription.unsubscribe();
    }

    onToggleError() {
        this.isActive = !this.isActive;
    }
}