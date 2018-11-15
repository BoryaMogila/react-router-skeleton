import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import Html from '../../src/components/HtmlComponent';
import fetchComponentData from '../helpers/fetchComponentData';
import routes from '../routes/reactRoutes';
// import {Provider} from 'react-redux';
// import {createMemoryHistory, match, RouterContext} from 'react-router';
// import {syncHistoryWithStore} from 'react-router-redux'
// import createRoutes from '../../src/routes';
// import {configureStore} from '../../src/storeConfigurator'
// import detectMobile from '../helpers/detectMobile'
// import TranslatesProvider from '../../src/components/translate/TranslatesProvider'
// import getMenu from '../../src/api/menuApi'
// import { getMenuAction } from '../../src/actionCreators/menuActionCreators'
// import { selectCategoriesNames, selectCategories } from '../../src/selectors/menuSelectors'
//
// export default async function (ctx) {
//   ctx.setStatus = (status) => {
//     ctx.status = status;
//   };
//   if(!ctx.captures.length || !['ua', 'en', 'ru'].includes(ctx.captures[0])){
//     ctx.setStatus(302);
//     ctx.redirect('/en' + ctx.originalUrl);
//     return;
//   }
//   const lang = ctx.captures[0];
//   //Визначаємо тип девайсу для адаптивності
//   //noinspection JSUnresolvedVariable
//   const userAgent = ctx.req.headers['user-agent'];
//   const screenType = detectMobile(userAgent);
//   const memoryHistory = createMemoryHistory(ctx.originalUrl);
//   const initialState = {screenType};
//   const routes = createRoutes();
//   const store = configureStore(memoryHistory, initialState, []);
//   const history = syncHistoryWithStore(memoryHistory, store);
//   const categories = await getMenu() || {};
//   store.dispatch(getMenuAction(categories));
//   //noinspection JSUnresolvedVariable
//   const location = ctx.originalUrl;
//   let component;
//   const wait =  new Promise(function (resolve, reject) {
//     match({history, routes, location},  function (error, redirectLocation, renderProps){
//       const state = store.getState();
//       const categoriesNames = selectCategoriesNames(state);
//       const categories = selectCategories(state);
//       renderProps = {...renderProps, lang, categoriesNames, categories};
//       const renderWait = fetchComponentData(
//         store.dispatch,
//         renderProps.components,
//         renderProps.params,
//         renderProps,
//         ctx
//       ).then(() => {
//         component = (
//           <Provider store={store}>
//             <TranslatesProvider>
//               <RouterContext {...renderProps} />
//             </TranslatesProvider>
//           </Provider>
//         );
//       });
//       resolve(renderWait);
//     });
//   });
//   // end
//   await wait;
//
//   if ([301, 302].includes(Number(ctx.status))) return;
//   ReactDomServer.renderToString(<Html component={component} store={store}/>);
//   ctx.body = '<!doctype html>\n' +
//     ReactDomServer.renderToString(<Html component={component} store={store}/>);
//
// }

export default async (ctx) => {
    const [ route ] = routes.map((route) => {
        const { Component } = route;
        const match = matchPath(ctx.originalUrl,route);
        if (match) return { match, Component };
    }).filter(i => i);
    if (!route) {
        ctx.status = 404;
        return
    }
    const { Component, match } = route;
    await fetchComponentData(null, Component, { match }, ctx);
    console.log(match)
    ctx.body = '<!doctype html>\n' +
      ReactDomServer.renderToString(<Html component={<Component />} store={{dfdf: 'dfgdfg'}}/>);
}

