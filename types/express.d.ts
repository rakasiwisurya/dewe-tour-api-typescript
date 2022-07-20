declare namespace Express {
  export interface Request {
    user?: string | object;
    fileValidationError?: string | object;
  }
}
