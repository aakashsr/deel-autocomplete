import React from 'react';
import { DEBOUNCE_DELAY } from './utils/constants';
import Autocomplete from './Autocomplete';

function App() {
    return (
        <div className="App">
            <h1 className="title">GitHub User Search</h1>
            <Autocomplete
                placeholder="Type to search..."
                limit={15}
                delay={DEBOUNCE_DELAY}
            />
        </div>
    );
}

export default App;