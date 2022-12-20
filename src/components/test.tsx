import './test.scss';
import React from 'react';
import GoogleMapReact from 'google-map-react';

export function TestComponent(): React.ReactElement {
    const gmpKey: string | undefined = process.env['REACT_APP_GMP_KEY'];
    return (
        <div className={'spg-test'} style={{ height: '400px', width: '100%' }}>
            testCompsss
            {!!gmpKey && (
                <GoogleMapReact
                    bootstrapURLKeys={{ key: gmpKey, language: 'en', region: 'en' }}
                    defaultCenter={{ lat: 51.5074, lng: 0.1278 }}
                    defaultZoom={10}
                />
            )}
        </div>
    );
}
