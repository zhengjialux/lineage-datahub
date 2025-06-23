
import { ConsoleSqlOutlined } from '@ant-design/icons';
import type { DataJob, SearchResult } from './types.generated';
import {EntityType} from './types.generated'
import { EntityCapabilityType, IconStyleType, PreviewType } from './entity/Entity';
import type { Entity } from './entity/Entity';
import type { GenericEntityProperties } from './entity/shared/types';
import { getDataForEntityType } from './entity/shared/containers/profile/utils';
import { DataFlowEntity } from './DataFlowEntity';

/**
 * Definition of the DataHub DataJob entity.
 */
export class DataJobEntity implements Entity<DataJob> {
    type: EntityType = EntityType.DataJob;

    icon = (fontSize: number, styleType: IconStyleType, color?: string) => {
        if (styleType === IconStyleType.TAB_VIEW) {
            return <ConsoleSqlOutlined style={{ fontSize, color }} />;
        }

        if (styleType === IconStyleType.HIGHLIGHT) {
            return <ConsoleSqlOutlined style={{ fontSize, color: color || '#B37FEB' }} />;
        }

        return (
            <ConsoleSqlOutlined
                style={{
                    fontSize,
                    color: color || '#BFBFBF',
                }}
            />
        );
    };

    isSearchEnabled = () => true;

    isBrowseEnabled = () => false;

    isLineageEnabled = () => true;

    getAutoCompleteFieldName = () => 'name';

    getGraphName = () => 'dataJob';

    getPathName = () => 'tasks';

    getEntityName = () => 'Task';

    getCollectionName = () => 'Tasks';

    renderProfile = (urn: string) => <></>;

    getSidebarSections = () => [];

    getOverridePropertiesFromEntity = (dataJob?: DataJob | null): GenericEntityProperties => {
        // TODO: Get rid of this once we have correctly formed platform coming back.
        const name = dataJob?.properties?.name;
        const externalUrl = dataJob?.properties?.externalUrl;
        return {
            name,
            externalUrl,
            platform: dataJob?.dataFlow?.platform,
        };
    };

    renderPreview = (_: PreviewType, data: DataJob) => {
        return <></>
    };

    renderSearch = (result: SearchResult) => {
        return <></>;
    };

    getExpandedNameForDataJob = (entity: DataJob): string => {
        const name = this.displayName(entity);
        const flowName = entity?.dataFlow ? new DataFlowEntity().displayName(entity?.dataFlow) : undefined;

        // if we have no name, just return blank. this should not happen, so dont try & construct a name
        if (!name) {
            return '';
        }

        // if we have a flow name, return the full name of flow.task
        if (flowName) {
            return `${flowName}.${name}`;
        }

        // otherwise, just return the task name (same as non-expanded)
        return name;
    };

    getLineageVizConfig = (entity: DataJob) => {
        return {
            urn: entity?.urn,
            name: this.displayName(entity),
            expandedName: this.getExpandedNameForDataJob(entity),
            type: EntityType.DataJob,
            icon: entity?.dataFlow?.platform?.properties?.logoUrl || undefined,
            platform: entity?.dataFlow?.platform,
            health: entity?.health || undefined,
        };
    };

    displayName = (data: DataJob) => {
        return data.properties?.name || data.urn;
    };

    getGenericEntityProperties = (data: DataJob) => {
        return getDataForEntityType({
            data,
            entityType: this.type,
            getOverrideProperties: this.getOverridePropertiesFromEntity,
        });
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
