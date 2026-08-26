declare function verifyProjectOwnership(projectId: string, userId: string): Promise<{
    project: any;
    owned: boolean;
}>;
export declare const builderRoutes: any;
export { verifyProjectOwnership };
