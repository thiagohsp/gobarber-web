import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'user-name',
        email: 'johndoe@example.com',
      },
      token: 'user-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const storageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(storageSetItemSpy).toHaveBeenCalledWith(
      '@GoB:token',
      apiResponse.token,
    );
    expect(storageSetItemSpy).toHaveBeenCalledWith(
      '@GoB:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when auth', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoB:token':
          return 'user-token';
        case '@GoB:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'user-name',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoB:token':
          return 'user-token';
        case '@GoB:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'user-name',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const storageRemoveItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(storageRemoveItemSpy).toHaveBeenCalledWith('@GoB:token');
    expect(storageRemoveItemSpy).toHaveBeenCalledWith('@GoB:user');
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const storageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-id',
      name: 'user-name',
      email: 'johndoe@example.com',
      avatar_url: 'user-avatar-url',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(storageSetItemSpy).toHaveBeenCalledWith(
      '@GoB:user',
      JSON.stringify(user),
    );

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });
});
