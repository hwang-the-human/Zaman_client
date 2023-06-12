import {combineReducers, createStore} from 'redux';
import _ from 'lodash';

//ACTIONS

export function setBottomMenu(bottomMenu) {
  return {
    type: 'SWITCH_BOTTOM_MENU',
    payload: bottomMenu,
  };
}

export function pushOrder(order) {
  return {
    type: 'PUSH_ORDER',
    payload: order,
  };
}

export function changeQuantityOrder(path_id, _id, quantity) {
  return {
    type: 'CHANGE_QUANTITY_ORDER',
    payload: {
      path_id: path_id,
      _id: _id,
      quantity: quantity,
    },
  };
}

export function removeOrder(path_id, _id) {
  return {
    type: 'REMOVE_ORDER',
    payload: {path_id: path_id, _id: _id},
  };
}

export function setTrackedOrders(trackedOrders) {
  return {
    type: 'SET_TRACKED_ORDER',
    payload: trackedOrders,
  };
}

export function pushTrackedOrder(trackedOrder) {
  return {
    type: 'PUSH_TRACKED_ORDER',
    payload: trackedOrder,
  };
}

export function removeTrackedOrder(_id) {
  return {
    type: 'REMOVE_TRACKED_ORDER',
    payload: _id,
  };
}

export function setPaymentLoading(opened, success) {
  return {
    type: 'SET_PAYMENT_LOADING',
    payload: {opened: opened, success: success},
  };
}

export function setLastAxisTrack(x, y) {
  return {
    type: 'SET_LAST_AXIS_TRACK',
    payload: {x: x, y: y},
  };
}

export function setCafeOpened(opened) {
  return {
    type: 'SET_CAFE_OPENED',
    payload: opened,
  };
}

export function setLoading(opened, done) {
  return {
    type: 'SET_LOADING',
    payload: {opened: opened, done: done},
  };
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    payload: user,
  };
}

export function setCurrentOrder(currentOrder) {
  return {
    type: 'SET_CURRENT_ORDER',
    payload: currentOrder,
  };
}

export function clearStore() {
  return {
    type: 'CLEAR_STORE',
  };
}

export function setFavourites(favourites) {
  return {
    type: 'SET_FAVOURITES',
    payload: favourites,
  };
}

export function pushFavourite(favourite) {
  return {
    type: 'PUSH_FAVOURITE',
    payload: favourite,
  };
}

export function removeFavourite(favourite) {
  return {
    type: 'REMOVE_FAVOURITE',
    payload: favourite,
  };
}

//REDUCERS

function favouritesReducer(state = [], action) {
  const clonedState = _.cloneDeep(state);
  switch (action.type) {
    case 'SET_FAVOURITES':
      return action.payload;
    case 'PUSH_FAVOURITE':
      return [...state, action.payload];
    case 'REMOVE_FAVOURITE':
      return _.filter(clonedState, a => {
        return a !== action.payload;
      });
    default:
      return state;
  }
}

function currentOrderReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_CURRENT_ORDER':
      state = {...state, ...action.payload};
    default:
      return state;
  }
}

function userReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_USER':
      state = action.payload;
    default:
      return state;
  }
}

function loadingReducer(state = {opened: false, done: false}, action) {
  switch (action.type) {
    case 'SET_LOADING':
      state = action.payload;
    default:
      return state;
  }
}

function cafeOpenedReducer(state = false, action) {
  switch (action.type) {
    case 'SET_CAFE_OPENED':
      state = action.payload;
    default:
      return state;
  }
}

function lastAxisTrackReducer(state = {x: 0, y: 0}, action) {
  switch (action.type) {
    case 'SET_LAST_AXIS_TRACK':
      state = action.payload;
    default:
      return state;
  }
}

function paymentLoadingReducer(
  state = {opened: false, success: false},
  action,
) {
  switch (action.type) {
    case 'SET_PAYMENT_LOADING':
      state = action.payload;
    default:
      return state;
  }
}

function trackedOrdersReducer(state = [], action) {
  const clonedState = _.cloneDeep(state);
  switch (action.type) {
    case 'SET_TRACKED_ORDER':
      return action.payload;
    case 'PUSH_TRACKED_ORDER':
      return [...state, action.payload];
    case 'REMOVE_TRACKED_ORDER':
      return _.filter(clonedState, a => {
        return a._id !== action.payload;
      });
    default:
      return state;
  }
}

function bottomMenuReducer(
  state = {screen: '', opened: false, data: {}},
  action,
) {
  switch (action.type) {
    case 'SWITCH_BOTTOM_MENU':
      state = action.payload;
    default:
      return state;
  }
}

function ordersReducer(state = [], action) {
  const clonedState = _.cloneDeep(state);
  switch (action.type) {
    case 'PUSH_ORDER':
      return [...state, action.payload];
    case 'CHANGE_QUANTITY_ORDER':
      for (let i = 0; i < clonedState.length; i++) {
        if (clonedState[i][action.payload.path_id] === action.payload._id) {
          clonedState[i].quantity += action.payload.quantity;
          break;
        }
      }
      return clonedState;
    case 'REMOVE_ORDER':
      return _.filter(clonedState, a => {
        return a[action.payload.path_id] !== action.payload._id;
      });
    default:
      return state;
  }
}

//STORE

const reducers = combineReducers({
  cafeOpenedReducer,
  ordersReducer,
  bottomMenuReducer,
  trackedOrdersReducer,
  paymentLoadingReducer,
  lastAxisTrackReducer,
  loadingReducer,
  userReducer,
  currentOrderReducer,
  favouritesReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STORE') {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = createStore(rootReducer);

export default store;
