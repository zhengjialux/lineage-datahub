import React from 'react';
import type { SchemaField, SchemaFieldRef } from '../../types.generated';
import type { ColumnEdge } from '../types';

export const LineageExplorerContext = React.createContext<LineageExplorerContextType>({
    expandTitles: false,
    showColumns: false,
    isHideSiblingMode: false,
    collapsedColumnsNodes: null,
    setCollapsedColumnsNodes: null,
    fineGrainedMap: { forward: [], reverse: [] },
    selectedField: null,
    setSelectedField: () => {},
    highlightedEdges: [],
    setHighlightedEdges: () => {},
    visibleColumnsByUrn: {},
    setVisibleColumnsByUrn: () => {},
    columnsByUrn: {},
    setColumnsByUrn: () => {},
    refetchCenterNode: () => {},
    setShowColumns: () => {},
    setIsHideSiblingMode: () => {}
});

type LineageExplorerContextType = {
    expandTitles: boolean;
    showColumns: boolean;
    isHideSiblingMode?: boolean;
    collapsedColumnsNodes: any;
    setCollapsedColumnsNodes: any;
    fineGrainedMap: any;
    selectedField: SchemaFieldRef | null;
    setSelectedField: (field: SchemaFieldRef | null) => void;
    highlightedEdges: ColumnEdge[];
    setHighlightedEdges: React.Dispatch<React.SetStateAction<ColumnEdge[]>>;
    visibleColumnsByUrn: any;
    setVisibleColumnsByUrn: any;
    columnsByUrn: Record<string, SchemaField[]>;
    setColumnsByUrn: React.Dispatch<React.SetStateAction<Record<string, SchemaField[]>>>;
    refetchCenterNode: () => void;
    setShowColumns?: any;
    setIsHideSiblingMode?: any;
};
