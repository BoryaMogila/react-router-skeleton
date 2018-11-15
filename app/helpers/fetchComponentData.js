import {createOnServer} from '../../src/helpers/redirectorFactory'

export default (dispatch, component, props, ctx) => {
  return typeof component.fetchData !== 'function'
         ? Promise.resolve()
         : component.fetchData({dispatch, props, redirector: createOnServer(ctx)});
}
