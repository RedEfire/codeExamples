import React, { createContext, useReducer } from "react";

import {
  getDateSelectOption,
  DEFAULT_TIME_FILTER_VALUE,
  CANCELED,
} from "../constants";
import {
  GET_ITEMS_REQUEST,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  RESET_ITEMS_STATE,
  SET_ACTIVE_SIDEBAR_KEY,
  SET_LOADING_START,
  SET_LOADING_STOP,
  SET_ACTIVE_ITEM,
  SET_TIME_FILTER_VALUE,
  SET_FILTER_STRING,
  SET_NOTIFICATION_STRING,
  CANCEL_ITEM,
} from "../constants/actionConstants";
import {
  ItemsStoreType,
  ProviderPropsType,
  Action,
  ItemType,
} from "../types";

const initialState: ItemsStoreType = {
  dispatch() {
    return null;
  },
  items: [],
  loading: false,
  error: "",
  activeSidebarKey: undefined,
  activeItem: null,
  fetchItemsOptions: {
    start: getDateSelectOption[DEFAULT_TIME_FILTER_VALUE].value,
  },
  itemFilterString: "",
  notificationString: "",
};

const store = createContext(initialState);
const { Provider: StoreProvider } = store;

const reducer = (
  prevState: ItemsStoreType,
  action: Action
): ItemsStoreType => {
  switch (action.type) {
    case GET_ITEMS_REQUEST: {
      return { ...prevState, loading: true };
    }
    case GET_ITEMS_SUCCESS: {
      return {
        ...prevState,
        items: action.payload.items,
        loading: false,
      };
    }
    case GET_ITEMS_FAIL: {
      return { ...prevState, error: action.payload.error, loading: false };
    }
    case RESET_ITEMS_STATE: {
      return { ...initialState };
    }
    case SET_ACTIVE_SIDEBAR_KEY: {
      return { ...prevState, activeSidebarKey: action.payload.key };
    }
    case SET_LOADING_START: {
      return { ...prevState, loading: true };
    }
    case SET_LOADING_STOP: {
      return { ...prevState, loading: false };
    }
    case SET_ACTIVE_ITEM: {
      return { ...prevState, activeItem: action.payload.item };
    }
    case SET_TIME_FILTER_VALUE: {
      return {
        ...prevState,
        fetchItemsOptions: { start: action.payload.start },
      };
    }
    case SET_FILTER_STRING: {
      return {
        ...prevState,
        itemFilterString: action.payload.itemFilterString,
      };
    }
    case SET_NOTIFICATION_STRING: {
      return {
        ...prevState,
        notificationString: action.payload.notificationString,
      };
    }
    case CANCEL_ITEM: {
      const itemsTemp: ItemType[] = JSON.parse(
        JSON.stringify(prevState.items)
      );
      const item = itemsTemp.find(
        (item) => item.id === action.payload.itemId
      );
      if (item?.status) {
        item.status = CANCELED;
      }
      return {
        ...prevState,
        items: itemsTemp,
      };
    }
    default:
      return prevState;
  }
};

const Provider = ({ children }: ProviderPropsType): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  state.dispatch = dispatch;
  return <StoreProvider value={state}>{children}</StoreProvider>;
};

export { store, Provider };
