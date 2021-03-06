// import * as actions from "../actions/actions.js";

class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(response) {
    localStorage.setItem('token', response.token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
    // if(!localStorage.getItem('token')) return false;
    // else {
    // var x=actions.loadPage()
    // .then(value=>{
    //   return true;
    // })
    // .catch(error=>{
    //   console.log("error ", error)
    // });
    // return x;
    // }
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('email_id');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

}


export default Auth;