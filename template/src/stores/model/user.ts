import { observable, computed } from 'mobx';

import { IUserStore } from '../user';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

export default class User implements IUser {
  @observable public firstName = '';

  @observable public lastName = '';

  @observable public email = '';

  public constructor(
    private store: IUserStore,
    { firstName, lastName, email }: Omit<IUser, 'store'>,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  @computed get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
