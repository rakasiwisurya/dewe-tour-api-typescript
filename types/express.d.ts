declare namespace Express {
  import { JwtPayload } from "jsonwebtoken";

  export interface Request {
    user?: JwtPayload;
    fileValidationError?: string | object;
    file: {
      path: string;
      filename: string;
    };
  }
}
