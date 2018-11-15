import Router from 'koa-router';
import reactApp from '../controllers/reactRouterController';

let router = Router();

router.get('/favicon.ico',async (ctx) =>{
  ctx.status = 404;
});
router.get('/*', reactApp);

export default router;

// 195.54.162.152 vps6944.hyperhost.name  3470e0437cfb