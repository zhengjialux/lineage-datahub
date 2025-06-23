import {KEY_SCHEMA_PREFIX, VERSION_PREFIX} from './constants';
import type { PropertyValue } from '../types.generated';

export function downgradeV2FieldPath(fieldPath?: string | null) {
    if (!fieldPath) {
        return fieldPath;
    }

    const cleanedFieldPath = fieldPath.replace(KEY_SCHEMA_PREFIX, '').replace(VERSION_PREFIX, '');

    // strip out all annotation segments
    return cleanedFieldPath
        .split('.')
        .map((segment) => (segment.startsWith('[') ? null : segment))
        .filter(Boolean)
        .join('.');
}

export function getStructuredPropertyValue(value: PropertyValue) {
    if (value.__typename === 'StringValue') {
        return value.stringValue;
    }
    if (value.__typename === 'NumberValue') {
        return value.numberValue;
    }
    return null;
}
