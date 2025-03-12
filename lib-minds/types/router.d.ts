import { Path } from 'expo-router';

declare module 'expo-router' {
  export function useRouter(): {
    push: (path: Path | typeof ROUTES.ADMIN_HOME | typeof ROUTES.USER_HOME | typeof ROUTES.USER_BOOKS) => void;
    replace: (path: Path | typeof ROUTES.ADMIN_HOME | typeof ROUTES.USER_HOME | typeof ROUTES.USER_BOOKS) => void;
    back: () => void;
  };
}