import { call, put, select } from 'redux-saga/effects';
import MatchesActions from '../redux/matchesRedux';
import { parseYearMatches, parseClosestMatch } from '../utils/dataParser';
import { getResponseResult, getResponseError } from '../utils/responseHelpers';
import { get } from 'lodash';

export function * getMatches (api, action) {
  const { year } = action;

  if (!year) {
    yield put(MatchesActions.getMatchesFail());
    return;
  }

  const response = yield call(api.getMatchesReq, year);

  const error = getResponseError(response);
  const result = getResponseResult(response);

  if (response.ok && !error && result) {
    yield put(MatchesActions.getMatchesSuccess(parseYearMatches(result), year));
  } else {
    yield put(MatchesActions.getMatchesFail());
  }
}

const getStateYearMatches = (state) => {
  const {matches: {year, matches}} = state;
  const yearMatches = get(matches, [year]);
  return {year, yearMatches};
}

export function * getCurrentYearMatches (api, action) {
  const {year, yearMatches} = yield select(getStateYearMatches);
  if (!yearMatches) {
    yield getMatches(api, {...action, year});
  }
}

export function * getClosestMatch (api) {
  const response = yield call(api.getClosestMatchReq);

  const error = getResponseError(response);
  const result = getResponseResult(response);

  if (response.ok && !error && result) {
    yield put(MatchesActions.getClosestMatchSuccess(parseClosestMatch(result)));
  } else {
    yield put(MatchesActions.getClosestMatchFail());
  }
}
