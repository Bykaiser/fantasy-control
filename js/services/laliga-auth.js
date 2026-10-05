import {request} from './api.js';
export const authStatus = () => request('auth/status');
export const connectLaliga = () => request('auth/connect',{});
