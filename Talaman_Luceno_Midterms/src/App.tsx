import { useEffect, useState } from 'react';
import { MicroserviceProvider, useMicroservice } from '../context/MicroserviceContext';
import * as api from '../src/types/api';


function Login() {
  const { state, dispatch } = useMicroservice();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_AUTH', payload: { user: data.user, token: data.token } });
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  return (
    <div>
      <h2>Microservice Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Log in</button>
      {state.error && <p>{state.error}</p>}
    </div>
  );
}

function Microservice() {
  const { state, dispatch } = useMicroservice();
  const [title, setTitle] = useState('');
  useEffect(() => {
    api.getMicroservice(state.token!)
      .then((data: any) => dispatch({ type: 'FETCH_SERVICES_SUCCESS', payload: data }))
      .catch((e: any) => dispatch({ type: 'SET_ERROR', payload: e.message }));
  }, [state.token, dispatch]);

  const add = async () => {
    try {
      const created = await api.createMicroservice(state.token!, { 
        name: 'Lemuel', endpointUrl:'Hi', environment: 'DEVELOPMENT', status: 'HEALTHY', version: 'version 1'})
      dispatch({ type: 'CREATE_SERVICE_SUCCESS', payload: created });
      setTitle('');
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const resolve = async (id: string) => {
    try {
      const updated = await api.updateMicroservice(state.token!, id, { status: 'HEALTHY' });
      dispatch({ type: 'UPDATE_SERVICE_SUCCESS', payload: updated });
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteMicroservice(state.token!, id);
      dispatch({ type: 'DELETE_SERVICE_SUCCESS', payload: id });
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  };

  return (
    <div>
      <h2>Microservice</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Service"
      />
      <button onClick={add}>Add</button>
      {state.error && <p>{state.error}</p>}
      <ul>
        {state.services.map((i:any) => (
          <li key={i.id}>
            {i.title} [{i.severity}] - {i.status}{' '}
            <button onClick={() => resolve(i.id)}>Resolve</button>
            <button onClick={() => remove(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Screen() {
  const { state } = useMicroservice();
  return state.token ? <Microservice  /> : <Login />; }

export default function App() {
  return (
    <MicroserviceProvider>
      <Screen />
    </MicroserviceProvider>
  );
}