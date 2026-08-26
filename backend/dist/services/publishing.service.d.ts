import { Request, Response } from "express";
export declare function getPublishedWebsite(slug: string): Promise<{
    id: any;
    name: any;
    slug: any;
    publishStatus: any;
    publishedAt: any;
    publishedCount: any;
    templateId: any;
    builderState: any;
    user: {
        id: any;
        name: any;
        email: any;
    };
} | null>;
export declare function handlePublicRoute(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
