import container from '../utils/bootstrap';
import packageJson from '../../package.json';

export interface IRootStore {
  appVersion: string;
}

export default class RootStore implements IRootStore {
  public appVersion = packageJson.version;

  public constructor() {
    // this.authStore = container.get('authStore');
  }
}
