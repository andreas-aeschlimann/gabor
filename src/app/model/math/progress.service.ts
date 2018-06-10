import {Injectable} from "@angular/core";

Injectable()
export class ProgressService {

    /**
     * The current calculation progress in percent
     */
    percentage: number = 0;

    /**
     * Determines whether a calculation is in progress or not.
     * @returns {boolean}
     */
    isInProgress(): boolean {
        return this.percentage > 0 && this.percentage < 100;
    }

    constructor() {}

}
