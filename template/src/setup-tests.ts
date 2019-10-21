// Add necessary testing setup here...
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
