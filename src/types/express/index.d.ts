// src/types/express/index.d.ts or a dedicated `custom.d.ts`
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}
