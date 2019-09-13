import Service from '.';
import { IUser } from 'Stores/model/user';

export interface IUserService {
  getById: (id: string) => Promise<IUser>;
}

export default class UserService extends Service implements IUserService {
  public getById = async (id: string): Promise<IUser> => {
    const result = await this.fetch(`${this.basePath}/user/${id}`);
    // Do some data manipulation here...
    return await result.json();
  };
}
