import { useEffect, useState, useContext } from 'react'
import EntityRegistry from './entity/EntityRegistry';
import { EntityRegistryContext } from './entityRegistryContext';
import LineageExplorer from './lineage/LineageExplorer'
import { LineageExplorerContext } from './lineage/utils/LineageExplorerContext'
import {DatasetEntity} from './DatasetEntity'
import {DataFlowEntity} from './DataFlowEntity'
import {DataJobEntity} from './DataJobEntity'
import {ChartEntity} from './ChartEntity'
import {DashboardEntity} from './DashboardEntity'
import { EntityType } from './types.generated'
import { UserEntity } from './User'
import './index.less'

// 测试初始化数据
import lineageTestData from './lineage.test.json'

const LineageAggregation = () => {
    const [ lineageData, setLineageData ] = useState<any>(null);
        
    const entityRegistry = new EntityRegistry();
    entityRegistry.register(new DatasetEntity())
    entityRegistry.register(new DataFlowEntity())
    entityRegistry.register(new DataJobEntity())
    entityRegistry.register(new ChartEntity())
    entityRegistry.register(new DashboardEntity())
    entityRegistry.register(new UserEntity())

    const fetchData = async () => {
        // const response = await fetch('/GetEntityLineage', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         dataResUrn: 'urn:li:dataset:(urn:li:dataPlatform:你好啊abcd哈哈啊,6c85e813-6aac-303c-a65c-588eff76c29b,PROD)',
        //     }),
        // });
        
        // if (!response.ok) throw new Error('请求失败');
        
        // const {data} = await response.json();
        setLineageData(lineageTestData);
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <EntityRegistryContext.Provider value={entityRegistry}>
                <LineageExplorerContext.Provider
                    value={{
                        expandTitles: false,
                        showColumns: false,
                        collapsedColumnsNodes: {},
                        setCollapsedColumnsNodes: null,
                        fineGrainedMap: {},
                        selectedField: null,
                        setSelectedField: () => {},
                        highlightedEdges: [],
                        setHighlightedEdges: () => {},
                        visibleColumnsByUrn: {},
                        setVisibleColumnsByUrn: () => {},
                        columnsByUrn: {},
                        setColumnsByUrn: () => {},
                        refetchCenterNode: () => {},
                        isDrag: true, 
                        setIsDrag: () => {},
                        isLineageModalVisible: false,
                        setIsLineageModalVisible: () => {}
                    }}>
                        {lineageData && <LineageExplorer 
                            type={EntityType.Dataset} 
                            urn={metadataInfo?.dataResUrn}
                            data={lineageData}
                            setLineageData={setLineageData}
                        />}
                </LineageExplorerContext.Provider>
            </EntityRegistryContext.Provider>
        </>
    )
}

export default LineageAggregation;