import React from 'react';
import { inject, observer } from 'mobx-react';

import { IRootStore } from '../stores';

type Store = {
  store: IRootStore;
};

// This is a custom MobX function that injects and observes a component with type safety
export function connect<MappedProps>(mapStoreToProps: (store: Store) => MappedProps) {
  return function<WrappedProps>(
    WrappedComponent: React.ComponentClass<WrappedProps> | React.StatelessComponent<WrappedProps>,
  ) {
    return (inject(mapStoreToProps)(observer(WrappedComponent)) as unknown) as React.ComponentClass<
      Partial<WrappedProps>
    >;
  };
}
