import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../redux/user/userSlice';

const rootReducer = combineReducers({user: userReducer});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // specify which reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware ({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

