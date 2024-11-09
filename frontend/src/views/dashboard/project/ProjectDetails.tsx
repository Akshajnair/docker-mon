import React, { useEffect, useState } from 'react';
import { useGetProjectDetailsQuery } from 'reducers/api/ProjectApiReducer';
import Card from 'components/card/Card';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useGetStatusQuery } from 'reducers/api/DockerApiReducer';
import ContainerGrid from 'components/container/ContainerGrid';
import Loader from 'components/loader/Loader';

function ProjectDetails({ projectFolderName }: { projectFolderName: string }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bg = useColorModeValue('white', 'navy.700');

  return (
    <div>
      <Card
        bg={bg}
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Containers
          </Text>
        </Flex>
        <Box>
          <ContainerGrid projectFolderName={projectFolderName} />
        </Box>
      </Card>
    </div>
  );
}

export default ProjectDetails;
