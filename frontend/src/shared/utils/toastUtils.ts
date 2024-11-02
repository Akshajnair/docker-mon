// utils/toastUtils.ts
import { useToast } from '@chakra-ui/react';

interface ShowToastOptions {
  title: string;
  description?: string;
  status: 'info' | 'warning' | 'success' | 'error';
  duration?: number;
}

export const showToast = ({
  title,
  description,
  status,
  duration,
}: ShowToastOptions) => {
  const toast = useToast();
  toast({
    title,
    description,
    status,
    duration: duration || 5000, // Default duration
    isClosable: true,
    position: 'top-right', // Customize position as needed
  });
};
