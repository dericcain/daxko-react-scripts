import Service from '.';
import { IUser } from 'Stores/model/user';

export interface IUserService {
  getById: (id: string) => Promise<IUser>;
}

export default class UserService extends Service implements IUserService {
  protected path = '/users';

  public getById = async (id: string): Promise<IUser> => {
    // Axios should be configured to already have the base path. See ./utils/request
    const result = await this.request.get<IUser>(`${this.path}/${id}`);

    // Do some data manipulation here...

    // Notice the nice autocompletion on "result"
    return result;
  };
}
