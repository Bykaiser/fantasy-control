import {request} from './api.js';
export const updateData = () => request('sync',{});
// Failure never clears the saved snapshot.
