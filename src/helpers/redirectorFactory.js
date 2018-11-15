import { replace } from 'connected-react-router';

/**
 * @param ctx
 * @returns {{redirect: (function(string): *), setStatus: (function(number))}}
 */
export const createOnServer = ctx => ({
  redirect: ctx.redirect.bind(ctx),
  locationRedirect: ctx.redirect.bind(ctx),
  setStatus(status) {
    ctx.status = status;
  },
});

/**
 * @param dispatch
 * @returns {{redirect: (function(string): *), setStatus: (function(number))}}
 */
export const createOnClient = dispatch => ({
  redirect: (url) => {
    dispatch(replace(url));
  },
  locationRedirect: (url) => {
    window.location = url;
  },
  setStatus: status => console.log(status),
});
