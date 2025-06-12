import * as React from 'react';
import { DatabaseOutlined } from '@ant-design/icons';
import { EntityType } from './types.generated';
import type { Dataset, SearchResult, DatasetProperties } from './types.generated';
import { IconStyleType, PreviewType, EntityCapabilityType } from './entity/Entity';
import type { Entity } from './entity/Entity';
import { getDataForEntityType } from './entity/shared/containers/profile/utils';
import type { GenericEntityProperties } from './entity/shared/types';
import { capitalizeFirstLetterOnly } from './shared/textUtil';

export class DatasetEntity implements Entity<Dataset> {
    type: EntityType = EntityType.Dataset;

    icon = (fontSize: number, styleType: IconStyleType, color?: string) => {
        if (styleType === IconStyleType.TAB_VIEW) {
            return <DatabaseOutlined style={{ fontSize, color }} />;
        }
        return <DatabaseOutlined style={{ fontSize, color: color || '#BFBFBF' }} />;
    };

    isSearchEnabled = () => true;
    isBrowseEnabled = () => true;
    isLineageEnabled = () => true;

    getGraphName = () => 'dataset';

    getPathName = () => 'dataset';
    getEntityName = () => 'Dataset';
    getCollectionName = () => 'Datasets';

    renderProfile = (urn: string) => {
        return <div>Basic Dataset Profile</div>;
    };

    renderPreview = (_: PreviewType, data: Dataset) => {
        return <div>{data.urn}</div>;
    };

    renderSearch = (result: SearchResult) => {
        return <div>renderSearch</div>;
    }

    displayName = (data: Dataset) => {
        return data?.editableProperties?.name || data?.properties?.name || data.name || data.urn;
    };

    getOverridePropertiesFromEntity = (dataset?: Dataset | null): GenericEntityProperties => {
        // if dataset has subTypes filled out, pick the most specific subtype and return it
        const subTypes = dataset?.subTypes;
        const extendedProperties: DatasetProperties | undefined | null = dataset?.properties && {
            ...dataset?.properties,
            qualifiedName: dataset?.properties?.qualifiedName || this.displayName(dataset),
        };
        return {
            name: dataset && this.displayName(dataset),
            externalUrl: dataset?.properties?.externalUrl,
            entityTypeOverride: subTypes ? capitalizeFirstLetterOnly(subTypes.typeNames?.[0]) : '',
            properties: extendedProperties,
        };
    };

    getGenericEntityProperties = (data: Dataset) => {
        return getDataForEntityType({
            data,
            entityType: this.type,
            getOverrideProperties: this.getOverridePropertiesFromEntity,
        });
    };

    getLineageVizConfig = (entity: Dataset) => {
        return {
            urn: entity?.urn,
            name: entity?.properties?.name || entity.name,
            expandedName: entity?.properties?.qualifiedName || entity?.properties?.name || entity.name,
            type: EntityType.Dataset,
            subtype: entity?.subTypes?.typeNames?.[0] || undefined,
            icon: entity?.platform?.properties?.logoUrl || undefined,
            platform: entity?.platform,
            health: entity?.health || undefined,
        };
    };
    
    supportedCapabilities = () => {
        return new Set([
            EntityCapabilityType.OWNERS,
            EntityCapabilityType.GLOSSARY_TERMS,
            EntityCapabilityType.TAGS,
            EntityCapabilityType.DOMAINS,
            EntityCapabilityType.DEPRECATION,
            EntityCapabilityType.SOFT_DELETE,
            EntityCapabilityType.DATA_PRODUCTS,
        ]);
    };
}