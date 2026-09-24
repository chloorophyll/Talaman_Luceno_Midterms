import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { State, Action } from '../src/types/index';

const initialState: State = { user: null, token: localStorage.getItem('token'), services: [], selectedEnvironment: 'ALL', loading: false, error: null};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };
    case 'SET_ENV_FILTER':
      return { ...state, selectedEnvironment: action.payload, token: action.payload, error: null };
    case 'FETCH_SERVICES_SUCCESS':                                    
      return { ...state, services: action.payload, loading: false, error: null };
    case 'CREATE_SERVICE_SUCCESS':                                    
      return { ...state, services: [...state.services,action.payload] };
    case 'UPDATE_SERVICE_SUCCESS':                                    
      return { ...state, services: state.services.map((i:any) => (i.id === action.payload.id ? action.payload : i)) };
    case 'DELETE_SERVICE_SUCCESS':                                    
      return { ...state, services: state.services.filter((i:any) => i.id !== action.payload) };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
type ContextValue = { state: State; dispatch: Dispatch<Action> };
const MicroserviceContext = createContext<ContextValue | undefined>(undefined);
export function MicroserviceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <MicroserviceContext.Provider value={{ state, dispatch }}>{children}</MicroserviceContext.Provider>;
} 
export function useMicroservice () {
  const ctx = useContext(MicroserviceContext);
  if (!ctx) throw new Error('useMicroservice must be used inside MicroserviceProvider');
  return ctx;
}