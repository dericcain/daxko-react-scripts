import React, { lazy } from 'react';
import { Router } from '@reach/router';

const Home = lazy(() => import('./home'));

export default function() {
  return (
    <Router>
      <Home path="/" />
    </Router>
  )
}
