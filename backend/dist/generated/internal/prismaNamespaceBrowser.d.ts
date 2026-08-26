import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Category: "Category";
    readonly Product: "Product";
    readonly ProductFeature: "ProductFeature";
    readonly ProductTechnology: "ProductTechnology";
    readonly ProductImage: "ProductImage";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly Project: "Project";
    readonly ProjectRequirement: "ProjectRequirement";
    readonly ProjectMessage: "ProjectMessage";
    readonly ProjectFile: "ProjectFile";
    readonly Notification: "Notification";
    readonly AuditLog: "AuditLog";
    readonly Template: "Template";
    readonly AIUsage: "AIUsage";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly status: "status";
    readonly emailVerified: "emailVerified";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly passwordResetToken: "passwordResetToken";
    readonly passwordResetExpires: "passwordResetExpires";
    readonly emailVerificationToken: "emailVerificationToken";
    readonly emailVerificationSent: "emailVerificationSent";
    readonly credits: "credits";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly shortDescription: "shortDescription";
    readonly fullDescription: "fullDescription";
    readonly price: "price";
    readonly discountPrice: "discountPrice";
    readonly categoryId: "categoryId";
    readonly demoUrl: "demoUrl";
    readonly status: "status";
    readonly featured: "featured";
    readonly license: "license";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const ProductFeatureScalarFieldEnum: {
    readonly id: "id";
    readonly productId: "productId";
    readonly name: "name";
};
export type ProductFeatureScalarFieldEnum = (typeof ProductFeatureScalarFieldEnum)[keyof typeof ProductFeatureScalarFieldEnum];
export declare const ProductTechnologyScalarFieldEnum: {
    readonly id: "id";
    readonly productId: "productId";
    readonly name: "name";
};
export type ProductTechnologyScalarFieldEnum = (typeof ProductTechnologyScalarFieldEnum)[keyof typeof ProductTechnologyScalarFieldEnum];
export declare const ProductImageScalarFieldEnum: {
    readonly id: "id";
    readonly productId: "productId";
    readonly url: "url";
    readonly alt: "alt";
    readonly order: "order";
};
export type ProductImageScalarFieldEnum = (typeof ProductImageScalarFieldEnum)[keyof typeof ProductImageScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly total: "total";
    readonly currency: "currency";
    readonly paymentStatus: "paymentStatus";
    readonly orderStatus: "orderStatus";
    readonly paymentId: "paymentId";
    readonly sessionId: "sessionId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly productId: "productId";
    readonly price: "price";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const ProjectScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly userId: "userId";
    readonly name: "name";
    readonly description: "description";
    readonly budget: "budget";
    readonly timeline: "timeline";
    readonly status: "status";
    readonly progress: "progress";
    readonly assignedDeveloper: "assignedDeveloper";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly builderState: "builderState";
    readonly templateId: "templateId";
    readonly publishStatus: "publishStatus";
    readonly publishedAt: "publishedAt";
    readonly publishedSlug: "publishedSlug";
    readonly publishedCount: "publishedCount";
};
export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];
export declare const ProjectRequirementScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly type: "type";
    readonly value: "value";
    readonly createdAt: "createdAt";
};
export type ProjectRequirementScalarFieldEnum = (typeof ProjectRequirementScalarFieldEnum)[keyof typeof ProjectRequirementScalarFieldEnum];
export declare const ProjectMessageScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly senderId: "senderId";
    readonly message: "message";
    readonly createdAt: "createdAt";
};
export type ProjectMessageScalarFieldEnum = (typeof ProjectMessageScalarFieldEnum)[keyof typeof ProjectMessageScalarFieldEnum];
export declare const ProjectFileScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly uploadedBy: "uploadedBy";
    readonly fileName: "fileName";
    readonly fileType: "fileType";
    readonly fileUrl: "fileUrl";
    readonly createdAt: "createdAt";
};
export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly message: "message";
    readonly read: "read";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly action: "action";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly userId: "userId";
    readonly details: "details";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const TemplateScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly previewUrl: "previewUrl";
    readonly category: "category";
    readonly pages: "pages";
    readonly sections: "sections";
    readonly defaultContent: "defaultContent";
    readonly defaultStyles: "defaultStyles";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum];
export declare const AIUsageScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly businessName: "businessName";
    readonly industry: "industry";
    readonly targetAudience: "targetAudience";
    readonly goal: "goal";
    readonly tone: "tone";
    readonly services: "services";
    readonly location: "location";
    readonly stylePreference: "stylePreference";
    readonly generationCount: "generationCount";
    readonly provider: "provider";
    readonly model: "model";
    readonly success: "success";
    readonly durationMs: "durationMs";
    readonly tokensUsed: "tokensUsed";
    readonly requestId: "requestId";
    readonly createdAt: "createdAt";
    readonly creditsConsumed: "creditsConsumed";
    readonly creditCategory: "creditCategory";
};
export type AIUsageScalarFieldEnum = (typeof AIUsageScalarFieldEnum)[keyof typeof AIUsageScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
