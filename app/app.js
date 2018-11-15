import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import config from '../src/helpers/config';

import bodyparser from './helpers/bodyParser';
import router from './helpers/router';

let app = new Koa();

bodyparser(app);
if(config.serve){
  app.use(mount('/react/public', serve('./public', {
    gzip: config.gzip
  })));
}
router(app);
app.listen(5000, function () {
    console.log('listening at port %d', 5000);
});