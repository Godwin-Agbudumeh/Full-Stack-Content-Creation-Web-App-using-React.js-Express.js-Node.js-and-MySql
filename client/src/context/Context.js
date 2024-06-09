import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
}

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE); //state = INITIAL_STATE, Reducer updates our state

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    return (
        <Context.Provider value={{currentUser:state.user, isFetching:state.isFetching, error:state.error, dispatch,}}>
            {children}
        </Context.Provider>
    );
}