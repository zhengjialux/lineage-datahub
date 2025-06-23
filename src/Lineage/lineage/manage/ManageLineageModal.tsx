import { LoadingOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { Direction } from '../types';
import type { UpdatedLineages } from '../types';
import AddEntityEdge from './AddEntityEdge';
import LineageEntityView from './LineageEntityView';
import LineageEdges from './LineageEdges';
import type { Entity } from '../../types.generated';
import { EntityType } from '../../types.generated';
import { useEntityRegistry } from '../../useEntityRegistry';
import { buildUpdateLineagePayload, recordAnalyticsEvents } from '../utils/manageLineageUtils';
import { EntityEditStatus } from '../../shared/constants'

const ModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TitleText = styled.div`
    font-weight: bold;
`;

const StyledModal = styled(Modal)`
    .ant-modal-body {
        padding: 0;
    }
`;

const LoadingWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 350px;
    font-size: 30px;
`;

interface Props {
    entityUrn: string;
    lineageDirection: Direction;
    closeModal: () => void;
    refetchEntity: () => void;
    setUpdatedLineages: React.Dispatch<React.SetStateAction<UpdatedLineages>>;
    showLoading?: boolean;
    entityType?: EntityType;
    entityPlatform?: string;
}

export default function ManageLineageModal({
    entityUrn,
    lineageDirection,
    closeModal,
    refetchEntity,
    setUpdatedLineages,
    showLoading,
    entityType,
    entityPlatform,
}: Props) {
    const entityRegistry = useEntityRegistry();
    const [entitiesToAdd, setEntitiesToAdd] = useState<Entity[]>([]);
    const [entitiesToRemove, setEntitiesToRemove] = useState<Entity[]>([]);
    const [data, setData] = useState({});
    const loading = false;

    // 查询现有的弹框数据
    useEffect(async () => {
        // const response = await fetch('/GetEntityLineage', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         dataResUrn: entityUrn,
        //         excludeDownstream: lineageDirection === Direction.Upstream,
        //         excludeUpstream: lineageDirection === Direction.Downstream
        //     }),
        // });
        
        // if (!response.ok) throw new Error('请求失败');
        
        // const {data} = await response.json();
        // setData(data);
    }, [])

    function saveLineageChanges() {
        try {
            const payload = buildUpdateLineagePayload(lineageDirection, entitiesToAdd, entitiesToRemove, entityUrn);
            // 上下游查询保存
            // const response = await fetch('/updateLineage', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(payload),
            // });
            
            // if (!response.ok) throw new Error('请求失败');
            // const {data} = await response.json();
            // if (data?.updateLineage) {
            //     closeModal();
            //     if (showLoading) {
            //         message.loading('Loading...');
            //     } else {
            //         message.success('Updated lineage!');
            //     }
            //     setTimeout(() => {
            //         refetchEntity();
            //         if (showLoading) {
            //             message.destroy();
            //             message.success('Updated lineage!');
            //         }
            //     }, 2000);

            //     setUpdatedLineages((updatedLineages) => ({
            //         ...updatedLineages,
            //         [entityUrn]: {
            //             lineageDirection,
            //             entitiesToAdd,
            //             urnsToRemove: entitiesToRemove.map((entity) => entity.urn),
            //         },
            //     }));
            //     recordAnalyticsEvents({
            //         lineageDirection,
            //         entitiesToAdd,
            //         entitiesToRemove,
            //         entityRegistry,
            //         entityType,
            //         entityPlatform,
            //     });
            // }
        } catch (error) {
            // message.error(error.message || 'Error updating lineage');
        }
    }

    const isSaveDisabled = !entitiesToAdd.length && !entitiesToRemove.length;

    return (
        <StyledModal
            title={<TitleText>管理{EntityEditStatus[lineageDirection]}血缘</TitleText>}
            open
            maskClosable={false}
            onCancel={closeModal}
            keyboard
            footer={
                <ModalFooter>
                    <Button onClick={closeModal} type="text">
                        取消
                    </Button>
                    <Button onClick={saveLineageChanges} disabled={isSaveDisabled}>
                        保存
                    </Button>
                </ModalFooter>
            }
        >
            {loading && (
                <LoadingWrapper>
                    <LoadingOutlined />
                </LoadingWrapper>
            )}
            {!loading && (
                <>
                    {data?.entity && <LineageEntityView entity={data.entity} />}
                    <AddEntityEdge
                        lineageDirection={lineageDirection}
                        setEntitiesToAdd={setEntitiesToAdd}
                        entitiesToAdd={entitiesToAdd}
                        entityUrn={entityUrn}
                        entityType={entityType}
                    />
                    <LineageEdges
                        entity={data?.entity}
                        lineageDirection={lineageDirection}
                        entitiesToAdd={entitiesToAdd}
                        entitiesToRemove={entitiesToRemove}
                        setEntitiesToAdd={setEntitiesToAdd}
                        setEntitiesToRemove={setEntitiesToRemove}
                    />
                </>
            )}
        </StyledModal>
    );
}
