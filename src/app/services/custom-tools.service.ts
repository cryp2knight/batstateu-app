import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomToolsService {

  constructor() { }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  validateInput(input: string) {
    if (input.trim().length > 0 && input.trim() !== null) {
      return true
    } else {
      return false
    }
  }



}
