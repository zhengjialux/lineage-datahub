import React from 'react';
import EntityRegistryV1 from './entity/EntityRegistry';

export type EntityRegistry = EntityRegistryV1;

export const EntityRegistryContext = React.createContext<EntityRegistryV1>(new EntityRegistryV1());
