import { LoadingOutlined, SubnodeOutlined } from '@ant-design/icons';
import { AutoComplete, Empty } from 'antd';
import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { useEntityRegistry } from '../../useEntityRegistry';
import { EntityType } from '../../types.generated';
import type { Entity } from '../../types.generated';
import { Direction } from '../types';
import { getValidEntityTypes } from '../utils/manageLineageUtils';
import LineageEntityView from './LineageEntityView';
import EntityRegistry from '../../entity/EntityRegistry';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { EntityEditStatus } from '../../shared/constants'

const AddEdgeWrapper = styled.div`
    padding: 15px 20px;
    display: flex;
    align-items: center;
`;

const AddLabel = styled.span`
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
`;

const AddIcon = styled(SubnodeOutlined)`
    margin-right: 5px;
    font-size: 16px;
`;

const StyledAutoComplete = styled(AutoComplete)`
    margin-left: 10px;
    flex: 1;
`;

const LoadingWrapper = styled.div`
    padding: 8px;
    display: flex;
    justify-content: center;

    svg {
        height: 15px;
        width: 15px;
        color: ${ANTD_GRAY[8]};
    }
`;

function getPlaceholderText(validEntityTypes: EntityType[], entityRegistry: EntityRegistry) {
    let placeholderText = '搜索';
    if (!validEntityTypes.length) {
        placeholderText = `${placeholderText}要添加的数据...`;
    } else if (validEntityTypes.length === 1) {
        placeholderText = `${placeholderText} ${entityRegistry.getCollectionName(validEntityTypes[0])}...`;
    } else {
        validEntityTypes.forEach((type, index) => {
            placeholderText = `${placeholderText} ${entityRegistry.getCollectionName(type)}${
                index !== validEntityTypes.length - 1 ? ', ' : '...'
            }`;
        });
    }
    return placeholderText;
}

export function existsInEntitiesToAdd(result: Entity, entitiesAlreadyAdded: Entity[]) {
    return !!entitiesAlreadyAdded.find((entity) => entity.urn === result.urn);
}

interface Props {
    lineageDirection: Direction;
    setEntitiesToAdd: React.Dispatch<React.SetStateAction<Entity[]>>;
    entitiesToAdd: Entity[];
    entityUrn: string;
    entityType?: EntityType;
}

export default function AddEntityEdge({
    lineageDirection,
    setEntitiesToAdd,
    entitiesToAdd,
    entityUrn,
    entityType,
}: Props) {
    const entityRegistry = useEntityRegistry();
    const [autoCompleteResults, setAutoCompleteResults] = useState({})
    const [queryText, setQueryText] = useState<string>('');
    const [loading, setLoading] = useState(false)
    const validEntityTypes = getValidEntityTypes(lineageDirection, entityType);

    async function handleSearch(text: string) {
        setAutoCompleteResults({})
        setQueryText(text);
        if (text !== '') {
            setLoading(true)
            // 搜索框查询
            // const response = await fetch('/GetEntityLineage', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         dataResUrn: entityUrn,
            //         types: validEntityTypes,
            //         query: text,
            //         limit: 15,
            //     }),
            // });
            
            // if (!response.ok) throw new Error('请求失败');
            
            // const {data} = await response.json();
            // setAutoCompleteResults(data);
            setLoading(false)
        }
    }
    
    const suggestions = JSON.stringify(autoCompleteResults?.autoCompleteForMultiple?.suggestions) !== '{}'
        ? autoCompleteResults?.autoCompleteForMultiple?.suggestions
        : [];
    function selectEntity(urn: string) {
        const resultEntities = suggestions?.flatMap(
            (suggestion) => suggestion.entities || [],
        );
        const selectedEntity = resultEntities?.find((entity) => entity.urn === urn);
        if (selectedEntity) {
            setEntitiesToAdd((existingEntities) => [...existingEntities, selectedEntity]);
        }
    }

    const renderSearchResult = (entity: Entity) => {
        return (
            <AutoComplete.Option value={entity.urn} key={entity.urn}>
                <LineageEntityView entity={entity} displaySearchResult />
            </AutoComplete.Option>
        );
    };

    const searchResults = suggestions
        ?.flatMap((suggestion) => suggestion.entities || [])
        .filter((entity) => entity && !existsInEntitiesToAdd(entity, entitiesToAdd) && entity.urn !== entityUrn)
        .map((entity) => renderSearchResult(entity));

    const placeholderText = getPlaceholderText(validEntityTypes, entityRegistry);

    return (
        <AddEdgeWrapper>
            <AddLabel>
                <AddIcon />
                添加{EntityEditStatus[lineageDirection]}
            </AddLabel>
            <StyledAutoComplete
                autoFocus
                showSearch
                value={queryText}
                placeholder="搜索要添加的数据"
                onSearch={handleSearch}
                onSelect={(urn: any) => selectEntity(urn)}
                filterOption={false}
                notFoundContent={(queryText.length > 3 && <Empty description="No Assets Found" />) || undefined}
            >
                {loading && (
                    <AutoComplete.Option value="loading">
                        <LoadingWrapper>
                            <LoadingOutlined />
                        </LoadingWrapper>
                    </AutoComplete.Option>
                )}
                {searchResults}
            </StyledAutoComplete>
        </AddEdgeWrapper>
    );
}
