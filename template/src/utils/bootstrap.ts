import { Container } from 'tiny-container';

import UserService from 'Services/user';
import UserStore from 'Stores/user';

// This is a very small IoC container that is perfect for connecting MobX stores.
// It makes injecting and testing simple. You can read more about it here:
// https://github.com/dericgw/tiny-container
const container = new Container();

export enum Identifiers {
  UserService = 'userService',
  UserStore = 'userStore',
}

container.register(Identifiers.UserService, UserService);
container.singleton(Identifiers.UserStore, UserStore, [Identifiers.UserService]);

export default container;
