import RootStore from 'Stores';

describe('User Store', () => {
  const user = {
    firstName: 'John',
    lastName: 'Snow',
    email: 'jon.snow@gmail.com',
  };

  const valueThatFetchShouldReturn = [];
  // This can be extracted into a common file so that all tests can share it. Then API calls are
  // easy to mock and return whatever values the API would return.
  const mockFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(valueThatFetchShouldReturn),
    }),
  );
  const store = new RootStore(mockFetch);

  it('should return false for authenticated user if there is no user', () => {
    expect(store.userStore.isAuthenticated).toBe(false);
  });

  it('should create a new user', () => {
    store.userStore.createUser(user);
    expect(store.userStore.user).not.toBeNull();
  });

  it('should return the users full name', () => {
    expect(store.userStore.user.fullName).toBe(`${user.firstName} ${user.lastName}`);
  });
});
