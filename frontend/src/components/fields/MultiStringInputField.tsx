import {
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { RiAddLargeFill, RiCloseLargeFill } from 'react-icons/ri';

interface MultiStringInputFieldProps {
  id: string;
  label: string;
  extra?: JSX.Element;
  placeholder?: string;
  type: string;
  mb?: string | number;
  value?: string[];
  onChange?: (e: { target: { id: string; value: string[] } }) => void;
  disabled?: boolean;
  className?: string;
}

const MultiStringInputField = ({
  id,
  label,
  extra,
  placeholder = '',
  type,
  mb = '20px',
  value = [],
  onChange = () => {},
  className = '',
}: MultiStringInputFieldProps) => {
  const [input, setInput] = useState('');

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  const removeElement = (element: string) => {
    const newValue = value.filter((x) => x !== element);
    onChange({ target: { id, value: newValue } });
  };

  const addElement = () => {
    if (input && !value.includes(input)) {
      onChange({ target: { id, value: [...value, input] } });
      setInput('');
    }
  };

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

      {value.map((element, index) => (
        <Flex key={index} mb="10px" align="center">
          <Input
            type={type}
            value={element}
            id={`${id}-${index}`}
            fontWeight="500"
            variant="main"
            placeholder={placeholder}
            _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
            h="44px"
            maxH="44px"
            me="10px"
            isReadOnly
          />
          <Button
            colorScheme="red"
            variant="solid"
            onClick={() => removeElement(element)}
          >
            <RiCloseLargeFill />
          </Button>
        </Flex>
      ))}

      <Flex align="center">
        <Input
          type={type}
          id={id}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fontWeight="500"
          variant="main"
          placeholder={placeholder}
          _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
          h="44px"
          maxH="44px"
          me="10px"
        />
        <Button colorScheme="teal" variant="solid" onClick={addElement}>
          <RiAddLargeFill />
        </Button>
      </Flex>
    </Flex>
  );
};

export default MultiStringInputField;
