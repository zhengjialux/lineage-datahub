import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd';
import * as React from 'react';

export default function DataHubTooltip(props: TooltipProps & React.RefAttributes<unknown>) {
    return <Tooltip {...props} showArrow={false} />;
}
