import { computed, observable, action } from 'mobx';

import { IRootStore } from './';
import User, { IUser } from './model/user';
import { IUserService } from 'Services/user';

export interface IUserStore {
  user?: IUser;
  isAuthenticated: boolean;
  createUser: (user: IUser) => void;
}

export default class UserStore implements IUserStore {
  @observable public user: IUser;

  public constructor(private rootStore: IRootStore, private userService: IUserService) {}

  @computed public get isAuthenticated() {
    return !!this.user;
  }

  @action
  public createUser = (user: Omit<IUser, 'fullName'>) => {
    this.user = new User(this, user);
  };
}
