import {
  LOADING,
  LOGIN,
  ERROR,
  LOGOUT,
  LOADING_AVATAR,
  LOAD_AVATAR,
  CREATING_USER,
  ERROR_CREATING_USER,
  GET_ROLES,
  GET_USERS,
  GET_DOCTORS_LIST,
  GET_DOC_LIST_LOADING,
  LOADING_APPROVED_DOCTORS,
  GET_APPROVED_DOCTORS,
} from "./types";
import { apiURL } from "./index.js";
import store from "../store";
import { generateAvatar } from "../../components/utils/helpers";
import { _fetchApi, _fetchApi2, _postApi } from "./api";
import { getFacilityInfo } from "./facility";
import { accountTypes } from "../../components/auth/login/login";

const endpoint = "auth";

export function patientSignup(data, callback = (f) => f, error = (f) => f) {
  return (dispatch) => {
    dispatch({ type: CREATING_USER });

    fetch(`${apiURL()}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((raw) => raw.json())
      .then((result) => {
        dispatch(
          patientLogin(
            { email: data.email, password: data.password },
            callback,
            error
          )
        );
      })
      .catch((err) => {
        error("An error occured");
        // console.log(err);
        dispatch({ type: ERROR, payload: "An error occured" });
      });
  };
}

export function createUser(data = [], success = (f) => f, error = (f) => f) {
  return (dispatch) => {
    dispatch({ type: CREATING_USER });
    _postApi(
      `${apiURL()}/${endpoint}/sign-up`,
      data,
      (result) => {
        // console.log(result);
        if (result.errors) {
          let err = Object.values(result.errors);
          error(err[0]);
          dispatch({ type: ERROR_CREATING_USER, payload: err[0] });
        } else {
          dispatch({ type: CREATING_USER });
          success();
        }
      },
      (err) => {
        // console.log(err);
        dispatch({ type: ERROR_CREATING_USER, payload: err });
      }
    );
  };
}

export function login({ username, password, accountType }, callback, error) {
  return (dispatch) => {
    switch (accountType) {
      case accountTypes.PATIENT: {
        dispatch(patientLogin({ email: username, password }, callback, error));
        break;
      }
      case accountTypes.DOCTOR: {
        dispatch(patientLogin({ email: username, password }, callback, error));
        break;
      }
      case accountTypes.OTHER: {
        dispatch(patientLogin({ email: username, password }, callback, error));
        break;
      }
      default:
        return null;
    }
  };
}

export function patientLogin(
  { email, password },
  cb = (f) => f,
  error = (f) => f
) {
  return async (dispatch) => {
    fetch(`${apiURL()}/users`)
      .then((raw) => raw.json())
      .then((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          localStorage.setItem("@@__token", user.id);
          dispatch({ type: LOGIN, payload: { user } });
          cb();
        } else {
          error("Invalid credentials");
          dispatch({ type: ERROR, payload: "Invalid credentials" });
        }
      })
      .catch((err) => {
        error("An error occured");
        dispatch({ type: ERROR, payload: "An error occured" });
      });
  };
}

export function authLoading() {
  return (dispatch) => {
    dispatch({ type: LOADING });
  };
}

export function checkAuthStatus(success, error) {
  return (dispatch) => {
    dispatch(init(success, error));
  };
}

export function logout(callback = (f) => f) {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("@@sudoEMR_token");
    localStorage.removeItem("@@__token");
    callback();
  };
}


const navigateBasedOnAccess = (access, history) => {
  if (access && access.length) {
    switch (access[0]) {
      case "Laboratory":
        return history.push("/me/lab");
      case "Accounts":
        return history.push("/me/account");
      case "Reports":
        return history.push("/me/report");
      case "Records":
        return history.push("/me/records");
      case "Doctors":
        return history.push("/me/doctors");
      case "Pharmacy":
        return history.push("/me/pharmacy");

      case "Inventory":
        return history.push("/me/inventory");

      case "Operation":
        return history.push("/me/operation");
      case "Admin":
        return history.push("/me/admin");

      case "Patient":
        return history.push("/user");
      default:
        return history.push("/");
    }
  }
};


export function init(history, location) {
  return (dispatch) => {
    dispatch({ type: "START_FULL_PAGE_LOADING" });
    let token = localStorage.getItem("@@__token");
    if (token) {
      fetch(`${apiURL()}/users/${token}`)
        .then((raw) => raw.json())
        .then((user) => {
          if (user) {
            dispatch({ type: LOGIN, payload: { user } });
            dispatch({ type: "STOP_FULL_PAGE_LOADING" });
            if (location.pathname === "/auth") {
              history.push("/");
            }
          } else {
            localStorage.removeItem("@@__token");
            dispatch({ type: "STOP_FULL_PAGE_LOADING" });
            history.push("/auth");
          }
        })
        .catch((err) => {
          localStorage.removeItem("@@__token");
          dispatch({ type: "STOP_FULL_PAGE_LOADING" });
          history.push("/auth");
        });
    } else {
      dispatch({ type: "STOP_FULL_PAGE_LOADING" });
      history.push("/auth");
    }
  };
}

// export function initUser(history = null, callback = (f) => f) {
//   return (dispatch) => {
//     let token = localStorage.getItem('@@__token');

//     if (token) {
//       /**
//        * Token present
//        * verifyToken */
//       verifyToken(token)
//         .then((data) => {
//           if (data.success) {
//             dispatch({ type: LOGIN, payload: data });
//             callback();
//           } else {
//             callback();
//             localStorage.removeItem('@@__token');
//             history.push('/auth');
//             console.log('Token expired');
//             dispatch({ type: LOGOUT });
//           }
//         })
//         .catch((err) => {
//           callback();
//           localStorage.removeItem('@@__token');
//           history.push('/auth');
//           console.log('Token expired');
//           dispatch({ type: LOGOUT });
//         });
//     } else {
//       /**
//        * No token found
//        * navigate user to auth page
//        */
//       callback();
//       history.push('/auth');
//     }
//   };
// }

// async function verifyToken(token) {
//   try {
//     let response = await fetch(`${apiURL()}/auth/verify-token`, {
//       method: 'GET',
//       headers: {
//         Authorization: token,
//       },
//     });
//     let data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }

export function loadUserAvatar() {
  return (dispatch) => {
    // console.log('loading');
    dispatch({ type: LOADING_AVATAR });
    let user = store.getState().auth.user;
    if (user) {
      if (user.image) {
        let avatar = user.image;
        dispatch({ type: LOAD_AVATAR, avatar });
        dispatch({ type: LOADING_AVATAR });
      } else {
        let { firstname, lastname } = user;
        let avatar = generateAvatar(firstname, lastname);
        dispatch({ type: LOAD_AVATAR, avatar });
        dispatch({ type: LOADING_AVATAR });
      }
    }
  };
}

export function getRoles() {
  return (dispatch) => {
    fetch(`${apiURL()}/roles`)
      .then((raw) => raw.json())
      .then((data) => {
        dispatch({ type: GET_ROLES, payload: data });
      })
      .catch((err) => console.log(err));
  };
}

export function getUsers() {
  return (dispatch) => {
    fetch(`${apiURL()}/users`)
      .then((raw) => raw.json())
      .then((data) => {
        dispatch({ type: GET_USERS, payload: data });
      })
      .catch((err) => {
        console.log(err);
        //
      });
  };
}

export function getDoctors() {
  return (dispatch) => {
    dispatch({ type: GET_DOC_LIST_LOADING });
    fetch(`${apiURL()}/doctors`)
      .then((raw) => raw.json())
      .then((data) => {
        dispatch({ type: GET_DOCTORS_LIST, payload: data });
        dispatch({ type: GET_DOC_LIST_LOADING });
      })
      .catch((err) => {
        // console.log(err);
        dispatch({ type: GET_DOC_LIST_LOADING });
      });
  };
}

export function getApprovedDoctors() {
  return (dispatch) => {
    dispatch({ type: LOADING_APPROVED_DOCTORS });
    fetch(`${apiURL()}/doctors?approved=true`)
      .then((raw) => raw.json())
      .then((data) => {
        dispatch({ type: GET_APPROVED_DOCTORS, payload: data });
        dispatch({ type: LOADING_APPROVED_DOCTORS });
      })
      .catch((err) => dispatch({ type: LOADING_APPROVED_DOCTORS }));
  };
}
