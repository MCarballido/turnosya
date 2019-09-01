import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_LOGIN_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGIN_FACEBOOK,
  ON_LOGIN_GOOGLE,
  ON_EMAIL_VERIFY_ASKED,
  ON_EMAIL_VERIFY_REMINDED
} from './types';

// Import getEnvVars() from environment.js
import getEnvVars from '../../environment';
const {
  facebookApiKey,
  facebookPermissions,
  iosClientId,
  androidClientId,
  googleScopes
} = getEnvVars();

export const onLoginValueChange = ({ prop, value }) => {
  return { type: ON_LOGIN_VALUE_CHANGE, payload: { prop, value } };
};

export const sendEmailVefification = () => {
  const { currentUser } = firebase.auth();
  currentUser.sendEmailVerification();

  return { type: ON_EMAIL_VERIFY_ASKED, payload: currentUser.email };
};

export const onLogin = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch({ type: ON_LOGIN_SUCCESS, payload: user });
        if (!user.user.emailVerified)
          dispatch({
            type: ON_EMAIL_VERIFY_REMINDED
          });
      })
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

export const onFacebookLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN_FACEBOOK });

    Expo.Facebook.logInWithReadPermissionsAsync(facebookApiKey, {
      permissions: facebookPermissions
    })
      .then(({ type, token }) => {
        if (type === 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            token
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(({ user, additionalUserInfo }) => {
              const { first_name, last_name } = additionalUserInfo.profile;

              const userData = {
                firstName: first_name,
                lastName: last_name,
                email: user.email,
                phone: user.phoneNumber,
                profilePicture: additionalUserInfo.profile.picture.data.url,
                commerceId: null,
                softDelete: null
              };

              if (additionalUserInfo.isNewUser) {
                const db = firebase.firestore();

                db.collection('Profiles')
                  .doc(user.uid)
                  .set(userData)
                  .then(() =>
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData })
                  );
              } else dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
            })
            .catch(error =>
              dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
            );
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

export const onGoogleLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN_GOOGLE });

    Expo.Google.logInAsync({
      iosClientId,
      androidClientId,
      scopes: googleScopes
    })
      .then(({ type, idToken, accessToken }) => {
        if (type === 'success') {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          );

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(({ user, additionalUserInfo }) => {
              const { given_name, family_name } = additionalUserInfo.profile;

              const userData = {
                firstName: given_name,
                lastName: family_name,
                email: user.email,
                phone: user.phoneNumber,
                profilePicture: additionalUserInfo.profile.picture,
                commerceId: null,
                softDelete: null
              };

              if (additionalUserInfo.isNewUser) {
                let db = firebase.firestore();

                db.collection('Profiles')
                  .doc(user.uid)
                  .set(userData)
                  .then(() =>
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData })
                  );
              } else dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
            })
            .catch(error =>
              dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
            );
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

export const onLogout = () => {
  return dispatch => {
    dispatch({ type: ON_LOGOUT });

    firebase
      .auth()
      .signOut()
      .then(() => dispatch({ type: ON_LOGOUT_SUCCESS }))
      .catch(() => dispatch({ type: ON_LOGIN_FAIL }));
  };
};

export const userReauthenticate = async (password = null) => {
  const { currentUser } = firebase.auth();
  const provider = currentUser.providerData[0].providerId;
  var credential;

  if (provider == 'password') {
    credential = await firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    );
  } else if (provider == 'facebook.com') {
    await Expo.Facebook.logInWithReadPermissionsAsync(facebookApiKey, {
      permissions: facebookPermissions
    }).then(({ type, token }) => {
      if (type === 'success') {
        credential = firebase.auth.FacebookAuthProvider.credential(token);
      }
    });
  } else if (provider == 'google.com') {
    await Expo.Google.logInAsync({
      iosClientId,
      androidClientId,
      scopes: googleScopes
    }).then(({ type, idToken, accessToken }) => {
      if (type === 'success') {
        credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
      }
    });
  }

  return currentUser.reauthenticateWithCredential(credential);
};
