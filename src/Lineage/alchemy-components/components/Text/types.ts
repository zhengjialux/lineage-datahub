import type { HTMLAttributes } from 'react';
import type { Color, FontSizeOptions, FontColorOptions, FontWeightOptions, SpacingOptions } from '../../theme/config';

export interface TextProps extends HTMLAttributes<HTMLElement> {
    type?: 'span' | 'p' | 'div' | 'pre';
    size?: FontSizeOptions;
    color?: FontColorOptions;
    colorLevel?: keyof Color;
    weight?: FontWeightOptions;
    lineHeight?: SpacingOptions;
}
