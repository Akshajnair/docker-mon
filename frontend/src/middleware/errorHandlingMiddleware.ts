import { createStandaloneToast } from '@chakra-ui/react';
import {
  Dispatch,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';

export const errorHandlingMiddleware: Middleware =
  (api: MiddlewareAPI) => (next: any) => (action: any) => {
    const toast = createStandaloneToast().toast;
    if (isRejectedWithValue(action)) {
      toast({
        title: 'Error Occurred',
        description:
          action.error?.data?.message || 'An unexpected error occurred.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }

    return next(action);
  };
