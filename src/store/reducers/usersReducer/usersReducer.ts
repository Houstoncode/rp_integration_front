import {
  UserAddPayload,
  UserPatchPayload,
  UserRemovePayload,
  UsersAction,
  UsersState,
  USERS_INIT,
  USER_ADD,
  USER_PATCH,
  USER_REMOVE,
} from './usersReducer.type';

const initialState: UsersState = {
  users: [],
};

export function users(state: UsersState = initialState, action: UsersAction) {
  switch (action.type) {
    case USERS_INIT: {
      return { ...state, ...action.payload };
    }

    case USER_PATCH: {
      const payload = action.payload as UserPatchPayload;
      const users = state.users;
      const index = users.findIndex((user) => user.id === payload.user.id);
      users.splice(index, 1, payload.user);

      return { ...state, users };
    }

    case USER_REMOVE: {
      const payload = action.payload as UserRemovePayload;
      const users = [...state.users];
      const index = users.findIndex((user) => user.id === payload.id);
      users.splice(index, 1);

      return { ...state, users };
    }

    case USER_ADD: {
      const payload = action.payload as UserAddPayload;

      const users = [...state.users];

      console.log(payload.user);

      users.push(payload.user);

      return { ...state, users };
    }

    default: {
      return state;
    }
  }
}
