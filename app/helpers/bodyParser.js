import bodyParser from 'koa-bodyparser';

export default function bodyparser(app) {
    app.use(bodyParser());
};