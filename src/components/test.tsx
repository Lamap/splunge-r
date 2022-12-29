import './test.scss';
import React from 'react';

export function TestComponent(): React.ReactElement {
    return (
        <>
            <div className={'spg-test'} style={{ height: '400px', width: '100%' }}>
                test component
            </div>
        </>
    );
}
