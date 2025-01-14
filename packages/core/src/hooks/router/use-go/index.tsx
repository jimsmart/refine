import { RouterBindingsContext } from "@contexts/router";
import { useResource } from "@hooks/resource";
import React, { useCallback, useContext } from "react";
import type {
    Action,
    BaseKey,
    GoConfig as GoConfigBase,
    IResourceItem,
} from "../../../interfaces";
import { useGetToPath } from "../use-get-to-path";

type ResourceWithoutId = {
    /**
     *  The name or identifier of the resource.
     */
    resource: string;
    action: Extract<Action, "create" | "list">;
    id?: never;
};

type ResourceWithId = {
    /**
     *  The name or identifier of the resource.
     */
    resource: string;
    action: Extract<Action, "edit" | "show" | "clone">;
    id: BaseKey;
};

export type Resource = ResourceWithoutId | ResourceWithId;

export type GoConfigWithResource = Omit<GoConfigBase, "to"> & {
    to?: GoConfigBase["to"] | Resource;
};

export const useGo = () => {
    const bindings = useContext(RouterBindingsContext);
    const { select: resourceSelect } = useResource();
    const getToPath = useGetToPath();

    const useGo = React.useMemo(
        () => bindings?.go ?? (() => () => undefined),
        [bindings?.go],
    );

    const goFromRouter = useGo();

    const go = useCallback(
        (config: GoConfigWithResource | GoConfigBase) => {
            if (typeof config.to !== "object") {
                return goFromRouter({ ...config, to: config.to });
            }

            // when config.to is an object, it means that we want to go to a resource.
            // so we need to find the path for the resource.
            const { resource } = resourceSelect(config.to.resource);
            handleResourceErrors(config.to, resource);
            const newTo = getToPath({
                resource,
                action: config.to.action,
                meta: {
                    id: config.to.id,
                },
            });

            return goFromRouter({
                ...config,
                to: newTo,
            });
        },
        [resourceSelect, goFromRouter],
    );

    return go;
};

/**
 * handle errors for resource
 * @internal
 */
export const handleResourceErrors = (to: Resource, resource: IResourceItem) => {
    if (!to?.action || !to?.resource) {
        throw new Error(`[useGo]: "action" or "resource" is required.`);
    }

    if (["edit", "show", "clone"].includes(to?.action) && !to.id) {
        throw new Error(
            `[useGo]: [action: ${to.action}] requires an "id" for resource [resource: ${to.resource}]`,
        );
    }

    const actionUrl = resource[to.action];
    if (!actionUrl) {
        throw new Error(
            `[useGo]: [action: ${to.action}] is not defined for [resource: ${to.resource}]`,
        );
    }
};
