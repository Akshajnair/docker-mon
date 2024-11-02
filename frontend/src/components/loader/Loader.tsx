import React, { ReactElement } from 'react';
import { Alert, Center, CircularProgress } from '@chakra-ui/react';

type LoaderProps =
  | {}
  | {
      isLoading: boolean;
      error: any;
      errorMsg?: string;
      children: ReactElement;
    };

const Loader: React.FC<LoaderProps> = (props) => {
  if ('isLoading' in props) {
    if (props.isLoading) {
      return <LoadingAnimation />;
    } else if (props.error) {
      return <Alert status="error">{props.errorMsg || props.error}</Alert>;
    } else {
      return props.children;
    }
  }
  return <LoadingAnimation />;
};

const LoadingAnimation = () => (
  <Center height="100%">
    <CircularProgress capIsRound isIndeterminate={true} thickness={15} />
  </Center>
);

export default Loader;
