import { computed, observable, action } from 'mobx';

import { IRootStore } from './';
import User, { IUser } from './model/user';
import { IUserService } from 'Services/user';

export interface IUserStore {
  user?: IUser;
  isAuthenticated: boolean;
}

export default class UserStore implements IUserStore {
  private rootStore: IRootStore;

  private userService: IUserService;

  @observable public user: IUser;

  public constructor({
    rootStore,
    userService,
  }: {
    rootStore: IRootStore;
    userService: IUserService;
  }) {
    this.rootStore = rootStore;
    this.userService = userService;
  }

  @computed get isAuthenticated() {
    return !!this.user;
  }

  @action
  createUser = (user: IUser) => {
    this.user = new User(this, user);
  };
}
