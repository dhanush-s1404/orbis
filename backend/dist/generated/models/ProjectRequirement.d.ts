import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ProjectRequirement
 *
 */
export type ProjectRequirementModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectRequirementPayload>;
export type AggregateProjectRequirement = {
    _count: ProjectRequirementCountAggregateOutputType | null;
    _min: ProjectRequirementMinAggregateOutputType | null;
    _max: ProjectRequirementMaxAggregateOutputType | null;
};
export type ProjectRequirementMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    type: $Enums.ProjectRequirementType | null;
    value: string | null;
    createdAt: Date | null;
};
export type ProjectRequirementMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    type: $Enums.ProjectRequirementType | null;
    value: string | null;
    createdAt: Date | null;
};
export type ProjectRequirementCountAggregateOutputType = {
    id: number;
    projectId: number;
    type: number;
    value: number;
    createdAt: number;
    _all: number;
};
export type ProjectRequirementMinAggregateInputType = {
    id?: true;
    projectId?: true;
    type?: true;
    value?: true;
    createdAt?: true;
};
export type ProjectRequirementMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    type?: true;
    value?: true;
    createdAt?: true;
};
export type ProjectRequirementCountAggregateInputType = {
    id?: true;
    projectId?: true;
    type?: true;
    value?: true;
    createdAt?: true;
    _all?: true;
};
export type ProjectRequirementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectRequirement to aggregate.
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRequirements to fetch.
     */
    orderBy?: Prisma.ProjectRequirementOrderByWithRelationInput | Prisma.ProjectRequirementOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ProjectRequirementWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRequirements from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRequirements.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectRequirements
    **/
    _count?: true | ProjectRequirementCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ProjectRequirementMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ProjectRequirementMaxAggregateInputType;
};
export type GetProjectRequirementAggregateType<T extends ProjectRequirementAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectRequirement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectRequirement[P]> : Prisma.GetScalarType<T[P], AggregateProjectRequirement[P]>;
};
export type ProjectRequirementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectRequirementWhereInput;
    orderBy?: Prisma.ProjectRequirementOrderByWithAggregationInput | Prisma.ProjectRequirementOrderByWithAggregationInput[];
    by: Prisma.ProjectRequirementScalarFieldEnum[] | Prisma.ProjectRequirementScalarFieldEnum;
    having?: Prisma.ProjectRequirementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectRequirementCountAggregateInputType | true;
    _min?: ProjectRequirementMinAggregateInputType;
    _max?: ProjectRequirementMaxAggregateInputType;
};
export type ProjectRequirementGroupByOutputType = {
    id: string;
    projectId: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt: Date;
    _count: ProjectRequirementCountAggregateOutputType | null;
    _min: ProjectRequirementMinAggregateOutputType | null;
    _max: ProjectRequirementMaxAggregateOutputType | null;
};
export type GetProjectRequirementGroupByPayload<T extends ProjectRequirementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectRequirementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectRequirementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectRequirementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectRequirementGroupByOutputType[P]>;
}>>;
export type ProjectRequirementWhereInput = {
    AND?: Prisma.ProjectRequirementWhereInput | Prisma.ProjectRequirementWhereInput[];
    OR?: Prisma.ProjectRequirementWhereInput[];
    NOT?: Prisma.ProjectRequirementWhereInput | Prisma.ProjectRequirementWhereInput[];
    id?: Prisma.StringFilter<"ProjectRequirement"> | string;
    projectId?: Prisma.StringFilter<"ProjectRequirement"> | string;
    type?: Prisma.EnumProjectRequirementTypeFilter<"ProjectRequirement"> | $Enums.ProjectRequirementType;
    value?: Prisma.StringFilter<"ProjectRequirement"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectRequirement"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
};
export type ProjectRequirementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
};
export type ProjectRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    projectId_type?: Prisma.ProjectRequirementProjectIdTypeCompoundUniqueInput;
    AND?: Prisma.ProjectRequirementWhereInput | Prisma.ProjectRequirementWhereInput[];
    OR?: Prisma.ProjectRequirementWhereInput[];
    NOT?: Prisma.ProjectRequirementWhereInput | Prisma.ProjectRequirementWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectRequirement"> | string;
    type?: Prisma.EnumProjectRequirementTypeFilter<"ProjectRequirement"> | $Enums.ProjectRequirementType;
    value?: Prisma.StringFilter<"ProjectRequirement"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectRequirement"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
}, "id" | "projectId_type">;
export type ProjectRequirementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProjectRequirementCountOrderByAggregateInput;
    _max?: Prisma.ProjectRequirementMaxOrderByAggregateInput;
    _min?: Prisma.ProjectRequirementMinOrderByAggregateInput;
};
export type ProjectRequirementScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectRequirementScalarWhereWithAggregatesInput | Prisma.ProjectRequirementScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectRequirementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectRequirementScalarWhereWithAggregatesInput | Prisma.ProjectRequirementScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProjectRequirement"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectRequirement"> | string;
    type?: Prisma.EnumProjectRequirementTypeWithAggregatesFilter<"ProjectRequirement"> | $Enums.ProjectRequirementType;
    value?: Prisma.StringWithAggregatesFilter<"ProjectRequirement"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectRequirement"> | Date | string;
};
export type ProjectRequirementCreateInput = {
    id?: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutRequirementsInput;
};
export type ProjectRequirementUncheckedCreateInput = {
    id?: string;
    projectId: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
};
export type ProjectRequirementUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutRequirementsNestedInput;
};
export type ProjectRequirementUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementCreateManyInput = {
    id?: string;
    projectId: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
};
export type ProjectRequirementUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementListRelationFilter = {
    every?: Prisma.ProjectRequirementWhereInput;
    some?: Prisma.ProjectRequirementWhereInput;
    none?: Prisma.ProjectRequirementWhereInput;
};
export type ProjectRequirementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectRequirementProjectIdTypeCompoundUniqueInput = {
    projectId: string;
    type: $Enums.ProjectRequirementType;
};
export type ProjectRequirementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectRequirementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectRequirementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectRequirementCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput> | Prisma.ProjectRequirementCreateWithoutProjectInput[] | Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput | Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectRequirementCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
};
export type ProjectRequirementUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput> | Prisma.ProjectRequirementCreateWithoutProjectInput[] | Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput | Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectRequirementCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
};
export type ProjectRequirementUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput> | Prisma.ProjectRequirementCreateWithoutProjectInput[] | Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput | Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectRequirementUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectRequirementUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectRequirementCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    disconnect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    delete?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    connect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    update?: Prisma.ProjectRequirementUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectRequirementUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectRequirementUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectRequirementUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectRequirementScalarWhereInput | Prisma.ProjectRequirementScalarWhereInput[];
};
export type ProjectRequirementUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput> | Prisma.ProjectRequirementCreateWithoutProjectInput[] | Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput | Prisma.ProjectRequirementCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectRequirementUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectRequirementUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectRequirementCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    disconnect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    delete?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    connect?: Prisma.ProjectRequirementWhereUniqueInput | Prisma.ProjectRequirementWhereUniqueInput[];
    update?: Prisma.ProjectRequirementUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectRequirementUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectRequirementUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectRequirementUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectRequirementScalarWhereInput | Prisma.ProjectRequirementScalarWhereInput[];
};
export type EnumProjectRequirementTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProjectRequirementType;
};
export type ProjectRequirementCreateWithoutProjectInput = {
    id?: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
};
export type ProjectRequirementUncheckedCreateWithoutProjectInput = {
    id?: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
};
export type ProjectRequirementCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput>;
};
export type ProjectRequirementCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectRequirementCreateManyProjectInput | Prisma.ProjectRequirementCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectRequirementUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectRequirementWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectRequirementUpdateWithoutProjectInput, Prisma.ProjectRequirementUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectRequirementCreateWithoutProjectInput, Prisma.ProjectRequirementUncheckedCreateWithoutProjectInput>;
};
export type ProjectRequirementUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectRequirementWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectRequirementUpdateWithoutProjectInput, Prisma.ProjectRequirementUncheckedUpdateWithoutProjectInput>;
};
export type ProjectRequirementUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectRequirementScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectRequirementUpdateManyMutationInput, Prisma.ProjectRequirementUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectRequirementScalarWhereInput = {
    AND?: Prisma.ProjectRequirementScalarWhereInput | Prisma.ProjectRequirementScalarWhereInput[];
    OR?: Prisma.ProjectRequirementScalarWhereInput[];
    NOT?: Prisma.ProjectRequirementScalarWhereInput | Prisma.ProjectRequirementScalarWhereInput[];
    id?: Prisma.StringFilter<"ProjectRequirement"> | string;
    projectId?: Prisma.StringFilter<"ProjectRequirement"> | string;
    type?: Prisma.EnumProjectRequirementTypeFilter<"ProjectRequirement"> | $Enums.ProjectRequirementType;
    value?: Prisma.StringFilter<"ProjectRequirement"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectRequirement"> | Date | string;
};
export type ProjectRequirementCreateManyProjectInput = {
    id?: string;
    type: $Enums.ProjectRequirementType;
    value: string;
    createdAt?: Date | string;
};
export type ProjectRequirementUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumProjectRequirementTypeFieldUpdateOperationsInput | $Enums.ProjectRequirementType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectRequirementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    type?: boolean;
    value?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectRequirement"]>;
export type ProjectRequirementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    type?: boolean;
    value?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectRequirement"]>;
export type ProjectRequirementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    type?: boolean;
    value?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectRequirement"]>;
export type ProjectRequirementSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    type?: boolean;
    value?: boolean;
    createdAt?: boolean;
};
export type ProjectRequirementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "type" | "value" | "createdAt", ExtArgs["result"]["projectRequirement"]>;
export type ProjectRequirementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectRequirementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectRequirementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type $ProjectRequirementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectRequirement";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        type: $Enums.ProjectRequirementType;
        value: string;
        createdAt: Date;
    }, ExtArgs["result"]["projectRequirement"]>;
    composites: {};
};
export type ProjectRequirementGetPayload<S extends boolean | null | undefined | ProjectRequirementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload, S>;
export type ProjectRequirementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectRequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectRequirementCountAggregateInputType | true;
};
export interface ProjectRequirementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectRequirement'];
        meta: {
            name: 'ProjectRequirement';
        };
    };
    /**
     * Find zero or one ProjectRequirement that matches the filter.
     * @param {ProjectRequirementFindUniqueArgs} args - Arguments to find a ProjectRequirement
     * @example
     * // Get one ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectRequirementFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectRequirementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ProjectRequirement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectRequirementFindUniqueOrThrowArgs} args - Arguments to find a ProjectRequirement
     * @example
     * // Get one ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectRequirementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ProjectRequirement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementFindFirstArgs} args - Arguments to find a ProjectRequirement
     * @example
     * // Get one ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectRequirementFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ProjectRequirement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementFindFirstOrThrowArgs} args - Arguments to find a ProjectRequirement
     * @example
     * // Get one ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectRequirementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ProjectRequirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectRequirements
     * const projectRequirements = await prisma.projectRequirement.findMany()
     *
     * // Get first 10 ProjectRequirements
     * const projectRequirements = await prisma.projectRequirement.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectRequirementWithIdOnly = await prisma.projectRequirement.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectRequirementFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ProjectRequirement.
     * @param {ProjectRequirementCreateArgs} args - Arguments to create a ProjectRequirement.
     * @example
     * // Create one ProjectRequirement
     * const ProjectRequirement = await prisma.projectRequirement.create({
     *   data: {
     *     // ... data to create a ProjectRequirement
     *   }
     * })
     *
     */
    create<T extends ProjectRequirementCreateArgs>(args: Prisma.SelectSubset<T, ProjectRequirementCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ProjectRequirements.
     * @param {ProjectRequirementCreateManyArgs} args - Arguments to create many ProjectRequirements.
     * @example
     * // Create many ProjectRequirements
     * const projectRequirement = await prisma.projectRequirement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectRequirementCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ProjectRequirements and returns the data saved in the database.
     * @param {ProjectRequirementCreateManyAndReturnArgs} args - Arguments to create many ProjectRequirements.
     * @example
     * // Create many ProjectRequirements
     * const projectRequirement = await prisma.projectRequirement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectRequirements and only return the `id`
     * const projectRequirementWithIdOnly = await prisma.projectRequirement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectRequirementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ProjectRequirement.
     * @param {ProjectRequirementDeleteArgs} args - Arguments to delete one ProjectRequirement.
     * @example
     * // Delete one ProjectRequirement
     * const ProjectRequirement = await prisma.projectRequirement.delete({
     *   where: {
     *     // ... filter to delete one ProjectRequirement
     *   }
     * })
     *
     */
    delete<T extends ProjectRequirementDeleteArgs>(args: Prisma.SelectSubset<T, ProjectRequirementDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ProjectRequirement.
     * @param {ProjectRequirementUpdateArgs} args - Arguments to update one ProjectRequirement.
     * @example
     * // Update one ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectRequirementUpdateArgs>(args: Prisma.SelectSubset<T, ProjectRequirementUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ProjectRequirements.
     * @param {ProjectRequirementDeleteManyArgs} args - Arguments to filter ProjectRequirements to delete.
     * @example
     * // Delete a few ProjectRequirements
     * const { count } = await prisma.projectRequirement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectRequirementDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ProjectRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectRequirements
     * const projectRequirement = await prisma.projectRequirement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectRequirementUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ProjectRequirements and returns the data updated in the database.
     * @param {ProjectRequirementUpdateManyAndReturnArgs} args - Arguments to update many ProjectRequirements.
     * @example
     * // Update many ProjectRequirements
     * const projectRequirement = await prisma.projectRequirement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectRequirements and only return the `id`
     * const projectRequirementWithIdOnly = await prisma.projectRequirement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectRequirementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectRequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ProjectRequirement.
     * @param {ProjectRequirementUpsertArgs} args - Arguments to update or create a ProjectRequirement.
     * @example
     * // Update or create a ProjectRequirement
     * const projectRequirement = await prisma.projectRequirement.upsert({
     *   create: {
     *     // ... data to create a ProjectRequirement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectRequirement we want to update
     *   }
     * })
     */
    upsert<T extends ProjectRequirementUpsertArgs>(args: Prisma.SelectSubset<T, ProjectRequirementUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectRequirementClient<runtime.Types.Result.GetResult<Prisma.$ProjectRequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ProjectRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementCountArgs} args - Arguments to filter ProjectRequirements to count.
     * @example
     * // Count the number of ProjectRequirements
     * const count = await prisma.projectRequirement.count({
     *   where: {
     *     // ... the filter for the ProjectRequirements we want to count
     *   }
     * })
    **/
    count<T extends ProjectRequirementCountArgs>(args?: Prisma.Subset<T, ProjectRequirementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectRequirementCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ProjectRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectRequirementAggregateArgs>(args: Prisma.Subset<T, ProjectRequirementAggregateArgs>): Prisma.PrismaPromise<GetProjectRequirementAggregateType<T>>;
    /**
     * Group by ProjectRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRequirementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends ProjectRequirementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectRequirementGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectRequirementGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProjectRequirement model
     */
    readonly fields: ProjectRequirementFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ProjectRequirement.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ProjectRequirementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the ProjectRequirement model
 */
export interface ProjectRequirementFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectRequirement", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectRequirement", 'String'>;
    readonly type: Prisma.FieldRef<"ProjectRequirement", 'ProjectRequirementType'>;
    readonly value: Prisma.FieldRef<"ProjectRequirement", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ProjectRequirement", 'DateTime'>;
}
/**
 * ProjectRequirement findUnique
 */
export type ProjectRequirementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter, which ProjectRequirement to fetch.
     */
    where: Prisma.ProjectRequirementWhereUniqueInput;
};
/**
 * ProjectRequirement findUniqueOrThrow
 */
export type ProjectRequirementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter, which ProjectRequirement to fetch.
     */
    where: Prisma.ProjectRequirementWhereUniqueInput;
};
/**
 * ProjectRequirement findFirst
 */
export type ProjectRequirementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter, which ProjectRequirement to fetch.
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRequirements to fetch.
     */
    orderBy?: Prisma.ProjectRequirementOrderByWithRelationInput | Prisma.ProjectRequirementOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectRequirements.
     */
    cursor?: Prisma.ProjectRequirementWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRequirements from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRequirements.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRequirements.
     */
    distinct?: Prisma.ProjectRequirementScalarFieldEnum | Prisma.ProjectRequirementScalarFieldEnum[];
};
/**
 * ProjectRequirement findFirstOrThrow
 */
export type ProjectRequirementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter, which ProjectRequirement to fetch.
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRequirements to fetch.
     */
    orderBy?: Prisma.ProjectRequirementOrderByWithRelationInput | Prisma.ProjectRequirementOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectRequirements.
     */
    cursor?: Prisma.ProjectRequirementWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRequirements from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRequirements.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRequirements.
     */
    distinct?: Prisma.ProjectRequirementScalarFieldEnum | Prisma.ProjectRequirementScalarFieldEnum[];
};
/**
 * ProjectRequirement findMany
 */
export type ProjectRequirementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter, which ProjectRequirements to fetch.
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRequirements to fetch.
     */
    orderBy?: Prisma.ProjectRequirementOrderByWithRelationInput | Prisma.ProjectRequirementOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectRequirements.
     */
    cursor?: Prisma.ProjectRequirementWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRequirements from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRequirements.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRequirements.
     */
    distinct?: Prisma.ProjectRequirementScalarFieldEnum | Prisma.ProjectRequirementScalarFieldEnum[];
};
/**
 * ProjectRequirement create
 */
export type ProjectRequirementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProjectRequirement.
     */
    data: Prisma.XOR<Prisma.ProjectRequirementCreateInput, Prisma.ProjectRequirementUncheckedCreateInput>;
};
/**
 * ProjectRequirement createMany
 */
export type ProjectRequirementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectRequirements.
     */
    data: Prisma.ProjectRequirementCreateManyInput | Prisma.ProjectRequirementCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ProjectRequirement createManyAndReturn
 */
export type ProjectRequirementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * The data used to create many ProjectRequirements.
     */
    data: Prisma.ProjectRequirementCreateManyInput | Prisma.ProjectRequirementCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ProjectRequirement update
 */
export type ProjectRequirementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProjectRequirement.
     */
    data: Prisma.XOR<Prisma.ProjectRequirementUpdateInput, Prisma.ProjectRequirementUncheckedUpdateInput>;
    /**
     * Choose, which ProjectRequirement to update.
     */
    where: Prisma.ProjectRequirementWhereUniqueInput;
};
/**
 * ProjectRequirement updateMany
 */
export type ProjectRequirementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectRequirements.
     */
    data: Prisma.XOR<Prisma.ProjectRequirementUpdateManyMutationInput, Prisma.ProjectRequirementUncheckedUpdateManyInput>;
    /**
     * Filter which ProjectRequirements to update
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * Limit how many ProjectRequirements to update.
     */
    limit?: number;
};
/**
 * ProjectRequirement updateManyAndReturn
 */
export type ProjectRequirementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * The data used to update ProjectRequirements.
     */
    data: Prisma.XOR<Prisma.ProjectRequirementUpdateManyMutationInput, Prisma.ProjectRequirementUncheckedUpdateManyInput>;
    /**
     * Filter which ProjectRequirements to update
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * Limit how many ProjectRequirements to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ProjectRequirement upsert
 */
export type ProjectRequirementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProjectRequirement to update in case it exists.
     */
    where: Prisma.ProjectRequirementWhereUniqueInput;
    /**
     * In case the ProjectRequirement found by the `where` argument doesn't exist, create a new ProjectRequirement with this data.
     */
    create: Prisma.XOR<Prisma.ProjectRequirementCreateInput, Prisma.ProjectRequirementUncheckedCreateInput>;
    /**
     * In case the ProjectRequirement was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ProjectRequirementUpdateInput, Prisma.ProjectRequirementUncheckedUpdateInput>;
};
/**
 * ProjectRequirement delete
 */
export type ProjectRequirementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
    /**
     * Filter which ProjectRequirement to delete.
     */
    where: Prisma.ProjectRequirementWhereUniqueInput;
};
/**
 * ProjectRequirement deleteMany
 */
export type ProjectRequirementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectRequirements to delete
     */
    where?: Prisma.ProjectRequirementWhereInput;
    /**
     * Limit how many ProjectRequirements to delete.
     */
    limit?: number;
};
/**
 * ProjectRequirement without action
 */
export type ProjectRequirementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectRequirement
     */
    select?: Prisma.ProjectRequirementSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProjectRequirement
     */
    omit?: Prisma.ProjectRequirementOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ProjectRequirementInclude<ExtArgs> | null;
};
