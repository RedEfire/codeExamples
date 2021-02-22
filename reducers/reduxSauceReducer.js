import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  getHistoryRequest: [],
  getHistorySuccess: ['history'],
  getHistoryFail: ['error'],
  cleanHistory: null,
});

export const HistoryTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  error: null,
  history: [],
});

export const getHistoryRequest = (state) => {
  return state.merge({ fetching: true });
};

export const getHistorySuccess = (state, action) => {
  const { history } = action;
  return state.merge({ fetching: false, history });
};

export const getHistoryFail = (state) => {
  return state.merge({ fetching: false });
};

export const cleanHistory = (state) => {
  return state.merge({fetching: false, error: null, history: []});
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_HISTORY_REQUEST]: getHistoryRequest,
  [Types.GET_HISTORY_SUCCESS]: getHistorySuccess,
  [Types.GET_HISTORY_FAIL]: getHistoryFail,
  [Types.CLEAN_HISTORY]: cleanHistory,
});
