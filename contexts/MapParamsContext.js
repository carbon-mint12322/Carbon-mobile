import moment from 'moment';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import call from '../utils/api';
import { getAllItemsDataByType } from '../utils/commonQueue';
import { getAllItems } from "../utils/eventQueue";
import networkContext from './NetworkContext';

const defaultValues = {
    params: {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 1,
        numberOfTries: 5
    },
    values: {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 1,
        numberOfTries: 5
    }
};

const MapParamsContext = createContext(defaultValues);

export const MapParamsProvider = ({ children }) => {

    const [params, setParams] = useState(defaultValues.params)
    const [values, setValues] = useState(defaultValues.values)

    const onChange = (name, value) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const apply = () => {
        setParams(values)
    }

    const reset = () => {
        setValues(params)
    }

    return (
        <MapParamsContext.Provider
            value={{
                values,
                params,
                onChange,
                apply,
                reset
            }}
        >
            {children}
        </MapParamsContext.Provider>
    );
};

export const useMapParamsContext = () => useContext(MapParamsContext);