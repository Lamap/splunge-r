import React from 'react';
import './App.css';
import { TestComponent } from './components/test';

function App(): React.ReactElement {
    return (
        <div className="App">
            something
            <TestComponent />
        </div>
    );
}

export default App;
