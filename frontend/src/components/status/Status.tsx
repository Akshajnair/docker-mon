import { Box, Flex, Tag } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import IDockerProjectSummary from '@models/interface/IDockerProjectSummary';
import { useAppSelector } from 'hooks';
import React from 'react';
import { useGetStatusQuery } from 'reducers/api/DockerApiReducer';
import { getProjectStatus } from 'services/DockerService';
import ProjectStateEnum from 'shared/enums/ProjectStatesEnums';

type StatusProps = { project: IDockerProjectSummary };

function Status(props: StatusProps) {
  const {
    data: statuses,
    isLoading,
    error,
  } = useGetStatusQuery(undefined, {
    // skip: true, // This prevents a new request from being sent
  });
  let color = 'red';
  const colorsMap = {
    [ProjectStateEnum.healthy]: 'green',
    [ProjectStateEnum.unhealthy]: 'yellow',
    [ProjectStateEnum.stopped]: 'red',
  };

  let state = ProjectStateEnum.stopped;

  if ('project' in props && statuses) {
    state = getProjectStatus(props.project.containers, statuses);
    color = colorsMap[state];
  }

  const pulse = keyframes`
  0% {
    transform: scale(.5);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;
  return (
    <Flex align="center" justify="center">
      {/* Outer Circle */}
      <Box
        position="relative"
        width="20px"
        height="20px"
        borderRadius="50%"
        border={`2px solid ${color}`}
        animation={`${pulse} 1.5s infinite`}
      />
      {/* Inner Dot */}
      <Box
        // position="absolute"
        top="50%"
        left="50%"
        width="10px"
        height="10px"
        borderRadius="50%"
        bg={`${color}.500`}
        transform="translate(-150%, 0%)"
      />
      <Tag colorScheme={color} borderRadius="full" px={3}>
        {ProjectStateEnum[state]}
      </Tag>
    </Flex>
  );
}

export default Status;
