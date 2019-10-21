import { NavigateFn } from '@reach/router';

import { RootStore } from './index';

export class UiStore {
  public constructor(private rootStore: RootStore, public navigate: NavigateFn) {}
}
