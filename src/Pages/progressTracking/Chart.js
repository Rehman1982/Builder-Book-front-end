import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars() {
    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: ['Target', 'Achieved', 'Cost',"Paid","Claimed"] }]}
            series={[{ data: [272206661, 7551417, 108699494,10869949,108699000] }]}
            width={500}
            height={300}
        />
    );
}
