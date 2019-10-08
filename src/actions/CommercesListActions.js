import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READING,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ON_COMMERCE_SEARCHING
} from './types';

export const commerceSearching = isSearching => {
  return { type: ON_COMMERCE_SEARCHING, payload: isSearching };
};

export const areasRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_AREAS_READING });
    db.collection('Areas')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        const areas = [];
        snapShot.forEach(doc => areas.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_AREAS_SEARCH_READ, payload: areas });
      });
  };
};

export const deleteFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .delete()
      .then(() => dispatch({ type: FAVORITE_COMMERCE_DELETED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const registerFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .set({})
      .then(() => dispatch({ type: FAVORITE_COMMERCE_ADDED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const readFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
      .get()
      .then(snapshot => {
        var favorites = [];
        snapshot.forEach(doc => favorites.push(doc.id));
        dispatch({ type: FAVORITE_COMMERCES_READ, payload: favorites });
      }
      );
  };
};

export const readOnlyFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: ONLY_FAVORITE_COMMERCES_READING });

    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
      .onSnapshot(snapshot => {
        var favoriteCommerces = [];
        var onlyFavoriteCommerces = [];
        var processedItems = 0;

        if (snapshot.empty) {
          return dispatch({
            type: ONLY_FAVORITE_COMMERCES_READ,
            payload: { favoriteCommerces, onlyFavoriteCommerces }
          });
        }

        snapshot.forEach(doc => {
          favoriteCommerces.push(doc.id);

          db.doc(`Commerces/${doc.id}`)
            .get()
            .then(commerce => {
              if (commerce.data().softDelete == null) {
                const { profilePicture, name, area, address } = commerce.data();
                onlyFavoriteCommerces.push({ profilePicture, name, address, areaName: area.name, objectID: commerce.id });
              }

              processedItems++;

              if (processedItems == favoriteCommerces.length) { // solucion provisoria
                dispatch({
                  type: ONLY_FAVORITE_COMMERCES_READ,
                  payload: { favoriteCommerces, onlyFavoriteCommerces }
                });
              }
            });
        });
      });
  };
};
