import { LineChartOutlined } from '@ant-design/icons';
import type { Chart, SearchResult } from './types.generated';
import {EntityType} from './types.generated';
import type { GenericEntityProperties } from './entity/shared/types';
import { capitalizeFirstLetterOnly } from './shared/textUtil';
import { EntityCapabilityType, IconStyleType, PreviewType } from './entity/Entity';
import type { Entity } from './entity/Entity';
import { getDataForEntityType } from './entity/shared/containers/profile/utils';

export const TYPE_ICON_CLASS_NAME = 'typeIcon';
/**
 * Definition of the DataHub Chart entity.
 */
export class ChartEntity implements Entity<Chart> {
    type: EntityType = EntityType.Chart;

    icon = (fontSize?: number, styleType?: IconStyleType, color?: string) => {
        if (styleType === IconStyleType.TAB_VIEW) {
            return <LineChartOutlined className={TYPE_ICON_CLASS_NAME} style={{ fontSize, color }} />;
        }

        if (styleType === IconStyleType.HIGHLIGHT) {
            return (
                <LineChartOutlined
                    className={TYPE_ICON_CLASS_NAME}
                    style={{ fontSize, color: color || 'rgb(144 163 236)' }}
                />
            );
        }

        if (styleType === IconStyleType.SVG) {
            return (
                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 00-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 00-11.3 0L266.3 586.7a8.03 8.03 0 000 11.3l39.5 39.7z" />
            );
        }

        return (
            <LineChartOutlined
                className={TYPE_ICON_CLASS_NAME}
                style={{
                    fontSize,
                    color: color || '#BFBFBF',
                }}
            />
        );
    };

    isSearchEnabled = () => true;

    isBrowseEnabled = () => true;

    isLineageEnabled = () => true;

    getAutoCompleteFieldName = () => 'title';

    getGraphName = () => 'chart';

    getPathName = () => this.getGraphName();

    getEntityName = () => 'Chart';

    getCollectionName = () => 'Charts';

    renderProfile = (urn: string) => <></>;

    getSidebarSections = () => [];

    getSidebarTabs = () => [];

    getOverridePropertiesFromEntity = (chart?: Chart | null): GenericEntityProperties => {
        // TODO: Get rid of this once we have correctly formed platform coming back.
        const name = chart?.properties?.name;
        const subTypes = chart?.subTypes;
        const externalUrl = chart?.properties?.externalUrl;
        return {
            name,
            externalUrl,
            entityTypeOverride: subTypes ? capitalizeFirstLetterOnly(subTypes.typeNames?.[0]) : '',
        };
    };

    renderPreview = (_: PreviewType, data: Chart) => {
        const genericProperties = this.getGenericEntityProperties(data);

        return <></>
    };

    renderSearch = (result: SearchResult) => {
        return <></>
    };

    renderSearchMatches = (result: SearchResult) => {
        return <></>
    };

    getLineageVizConfig = (entity: Chart) => {
        return {
            urn: entity.urn,
            name: entity.properties?.name || entity.urn,
            type: EntityType.Chart,
            icon: entity?.platform?.properties?.logoUrl || undefined,
            platform: entity?.platform,
            subtype: entity?.subTypes?.typeNames?.[0] || undefined,
            deprecation: entity?.deprecation,
        };
    };

    displayName = (data: Chart) => {
        return data.properties?.name || data.urn;
    };

    getGenericEntityProperties = (data: Chart) => {
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
            EntityCapabilityType.TEST,
            EntityCapabilityType.LINEAGE,
            EntityCapabilityType.HEALTH,
        ]);
    };

    renderEmbeddedProfile = (urn: string) => (<></>);
}
