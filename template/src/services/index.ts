interface IService {
  key: string;
}

// This class handles all of the things that all services would need
export default abstract class Service implements IService {
  // It is okay to use inference here and not type each property
  protected basePath = 'https://api.somewhere.com';

  protected clientId = '';

  protected clientSecret = '';

  public constructor(protected request: typeof fetch) {}

  public get key() {
    return `client_id=${this.clientId}&client_secret=${this.clientSecret}`;
  }
}
