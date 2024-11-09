import {
  Flex,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface RadioInputFieldProps {
  id: string;
  label: string;
  mb?: string | number;
  value?: string;
  onChange?: (value: any) => void;
  options: { value: string; title: string }[];
  className?: string;
}

const RadioInputField = ({
  id,
  label,
  mb = '20px',
  value = '',
  onChange = () => {},
  options = [],
  className = '',
}: RadioInputFieldProps) => {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  function handleChange(e: string) {
    onChange({ target: { id: id, value: e } });
  }

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
      </FormLabel>

      <RadioGroup
        onChange={handleChange}
        value={value}
        id={id}
        ms="10px"
        mt="5px"
      >
        <Stack direction="row" spacing={6}>
          {options.map(({ value, title }) => (
            <Radio size="lg" value={value} key={value}>
              {title}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

export default RadioInputField;
