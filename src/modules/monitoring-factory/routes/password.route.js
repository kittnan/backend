import { Router } from 'express';
const routes = Router();

import PasswordModel from '../models/password.js';

routes.route('/query/bypassword').post(async (req, res) => {
  const pass = await PasswordModel.findOne(req.body, (err) => {
    if (err) return handleError(err);
  });
  res.json(pass);
});

export default routes;