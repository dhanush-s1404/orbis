declare function verifyProjectOwnership(projectId: string, userId: string): Promise<{
    project: any;
    owned: boolean;
}>;
export declare const projectRoutes: any;
export { verifyProjectOwnership };
export default projectRoutes;
