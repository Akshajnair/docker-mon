// Chakra imports
import { Badge, Flex, Text } from '@chakra-ui/react';

import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  return (
    <Flex alignItems="center" flexDirection="column">
      <Text fontSize="30px" mb={5}>
        Docker{' '}
        <Badge fontWeight="bold" fontSize="22px">
          Mon
        </Badge>
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
