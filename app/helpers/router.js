import router from '../routes/index';

export default function (app){
    app
        .use(router.routes())
        .use(router.allowedMethods());
};