import packageJson from '../../package.json';
import UserStore, { IUserStore } from './user';
import UserService from '../services/user';
import { IRequest } from 'Utils/request';

export interface IRootStore {
  appVersion: string;
  userStore: IUserStore;
}

export default class RootStore implements IRootStore {
  public userStore: IUserStore;

  public constructor(request: IRequest) {
    // Glue everything together here so that when stores need to be tested, the dependencies can
    // be mocked very easily
    this.userStore = new UserStore(this, new UserService(request));
  }

  public get appVersion() {
    return packageJson.version;
  }
}
