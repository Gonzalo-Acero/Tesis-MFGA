import { Router } from 'express';
import { IndexController } from '../controllers';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app) {
    app.use('/api', router);

    router.get('/', indexController.handleGetIndex);
    // Define other routes here
}