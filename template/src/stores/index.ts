import container, { Identifiers } from 'Utils/bootstrap';
import packageJson from '../../package.json';
import { IUserStore } from './user';

export interface IRootStore {
  appVersion: string;
  userStore: IUserStore;
}

export default class RootStore implements IRootStore {
  public userStore: IUserStore;

  public constructor() {
    this.userStore = container.get(Identifiers.UserStore, { rootStore: this });
  }

  public get appVersion() {
    return packageJson.version;
  }
}
