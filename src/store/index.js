import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import emiReducer from './emiSlice';
import taxReducer from './taxSlice';
import profileReducer from './profileSlice';
import corpusReducer from '../features/corpus/corpusSlice'; // Import the new corpus reducer

const persistConfig = {
  key: 'app_v1',
  storage,
  whitelist: ['emi', 'tax', 'profile', 'corpus'], // Add 'corpus' to the whitelist
};

const rootReducer = combineReducers({
  emi: emiReducer,
  tax: taxReducer,
  profile: profileReducer,
  corpus: corpusReducer, // Add the corpus reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
