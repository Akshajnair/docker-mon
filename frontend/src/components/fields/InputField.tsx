// Chakra imports
import {
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  InputProps,
  FlexProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface InputFieldProps extends InputProps {
  id: string;
  label: string;
  extra?: ReactNode;
  placeholder?: string;
  mb?: FlexProps['mb'];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function InputField({
  id,
  label,
  extra,
  placeholder = '',
  type = 'text',
  mb = '20px',
  value,
  onChange,
  disabled = false,
  className = '',
  ...rest
}: InputFieldProps) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction="column" mb={mb} className={className}>
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        {label}
        {extra && (
          <Text fontSize="sm" fontWeight="400" ms="2px">
            {extra}
          </Text>
        )}
      </FormLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        fontWeight="500"
        variant="main"
        _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
        h="44px"
        maxH="44px"
        {...rest} // Spread any other input props
      />
    </Flex>
  );
}
