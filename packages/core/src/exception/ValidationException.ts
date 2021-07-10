import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  public name: string;
  public message: string;
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.name = 'ValidationException';
    this.message = 'Argument Validation Error';
    this.errors = errors;
  }
}
