declare namespace Express {
  export interface Request {
    user?: string | object;
    fileValidationError?: string | object;
    file: {
      path: string;
      filename: string;
    };
  }
}
