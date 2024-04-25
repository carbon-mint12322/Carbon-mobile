import { useState, useEffect } from 'react';

function usePrevState(initialValue) {
    const [value, setValue] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);

    useEffect(() => {
        setPrevValue(value);
    }, [value]);

    return [value, prevValue, setValue];
}

export default usePrevState;