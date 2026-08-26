import { Request, Response } from "express";
export declare function handleAIGenerate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function handleAIRewrite(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function handleAIHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function handleAIStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const aiRoutes: any;
