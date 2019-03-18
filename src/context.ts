import * as Express from 'express';
import { StateManager } from './StateManager';

export interface Context {
  stateManager: StateManager;
}

export const setupContext = ({
  req,
  res
}: { req: Express.Request, res: Express.Response, }
): Context => {
  req.sessionOptions.domain = req.hostname;
  req.sessionOptions.sameSite = true;
  return {
    stateManager: new StateManager(req.session),
  };
};
