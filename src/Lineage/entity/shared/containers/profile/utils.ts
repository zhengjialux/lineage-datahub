import { EntityType } from '../../../../types.generated';
import type { GenericEntityProperties } from '../../types';

export function getDataForEntityType<T>({
    data: entityData,
    getOverrideProperties,
    isHideSiblingMode,
}: {
    data: T;
    entityType?: EntityType;
    getOverrideProperties: (T) => GenericEntityProperties;
    isHideSiblingMode?: boolean;
}): GenericEntityProperties | null {
    if (!entityData) {
        return null;
    }
    const anyEntityData = entityData as any;
    let modifiedEntityData = entityData;
    // Bring 'customProperties' field to the root level.
    const customProperties = anyEntityData.properties?.customProperties || anyEntityData.info?.customProperties;
    if (customProperties) {
        modifiedEntityData = {
            ...entityData,
            customProperties,
        };
    }
    if (anyEntityData.tags) {
        modifiedEntityData = {
            ...modifiedEntityData,
            globalTags: anyEntityData.tags,
        };
    }

    const searchResults = JSON.stringify(anyEntityData?.siblingsSearch?.searchResults) !== '{}'
    if (
        searchResults &&
        anyEntityData?.siblingsSearch?.searchResults?.filter((sibling) => sibling.entity.exists).length > 0 &&
        !isHideSiblingMode
    ) {
        const genericSiblingProperties: GenericEntityProperties[] = anyEntityData?.siblingsSearch?.searchResults?.map(
            (sibling) => getDataForEntityType({ data: sibling.entity, getOverrideProperties: () => ({}) }),
        );

        const allPlatforms = anyEntityData.siblings.isPrimary
            ? [anyEntityData.platform, genericSiblingProperties?.[0]?.platform]
            : [genericSiblingProperties?.[0]?.platform, anyEntityData.platform];

        modifiedEntityData = {
            ...modifiedEntityData,
            siblingPlatforms: allPlatforms,
        };
    }

    return {
        ...modifiedEntityData,
        ...getOverrideProperties(entityData),
    };
}
