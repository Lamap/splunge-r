import './test.scss';
import React from 'react';

export function TestComponent(): React.ReactElement {
    function bela(): void {
        console.log('bela');
    }
    console.log(bela());
    return <div className={'spg-test'}>testCompsss</div>;
}
