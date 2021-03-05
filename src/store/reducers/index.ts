import { combineReducers } from 'redux';
import { users } from './usersReducer';
import { modals } from './modalsReducer';

export * from './modalsReducer';
export * from './usersReducer';

const webAppReducers = {
  users,
  modals,
};

export const combinedWebAppReducer = combineReducers(webAppReducers);
