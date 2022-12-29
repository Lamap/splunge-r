import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { TestComponent } from '../components/test';

export function Page1(): React.ReactElement {
    const [bela, setBela] = useState<number | number[]>();

    function handleChange(event: Event, value: number | number[], activeThumb: number): void {
        console.log(value);
        setBela(value);
    }
    return (
        <div>
            {bela}
            page1
            <TestComponent />
            <Slider aria-label="Volume" onChange={handleChange} />
        </div>
    );
}
