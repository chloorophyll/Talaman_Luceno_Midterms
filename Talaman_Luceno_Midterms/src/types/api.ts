import type { Microservice } from '../types';

const BASE = 'http://localhost:5173/api';
const headers = (token: string) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}
export async function getMicroservice(token: string): Promise<Microservice[]> {
  const res = await fetch(`${BASE}/services`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}
export async function createMicroservice(token: string, data: Omit<Microservice, 'id' | 'status'>): Promise<Microservice> {
  const res = await fetch(`${BASE}/services`, { method: 'POST', headers: headers(token), body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}
export async function updateMicroservice(token: string, id: string, data: Partial<Microservice>): Promise<Microservice> {
  const res = await fetch(`${BASE}/incidents/${id}`, { method: 'PATCH', headers: headers(token), body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}
export async function deleteMicroservice(token: string, id: string) {
  const res = await fetch(`${BASE}/incidents/${id}`, { method: 'DELETE', headers: headers(token) });
  if (!res.ok) throw new Error('Failed to delete');
}