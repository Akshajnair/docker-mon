import { Box, Flex, Tag } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import IDockerProjectSummary from '@models/interface/IDockerProjectSummary';
import ContainerStateEnum from 'shared/enums/ContainerStateEnum';
import React from 'react';
import { useGetStatusQuery } from 'reducers/api/DockerApiReducer';
import { getContainerStatus, getProjectStatus } from 'services/DockerService';
import ProjectStateEnum from 'shared/enums/ProjectStateEnums';

type StatusProps = {
  project?: IDockerProjectSummary;
  containerName?: string;
  small?: boolean;
  state?: string;
  displayText?: string;
};

function Status(props: StatusProps) {
  const { data: statuses } = useGetStatusQuery();

  const colorsMap: { [key: string]: string } = {
    healthy: 'green',
    unhealthy: 'yellow',
    stopped: 'red',
    created: 'yellow',
    restarting: 'red',
    running: 'green',
    removing: 'red',
    paused: 'yellow',
    exited: 'red',
    dead: 'red',
  };

  let state = props.state;

  if ('project' in props && statuses) {
    state =
      ProjectStateEnum[getProjectStatus(props.project.containers, statuses)];
  }
  if ('containerName' in props && statuses) {
    state =
      ContainerStateEnum[getContainerStatus(props.containerName, statuses)];
  }
  let color = colorsMap[state];

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
      {state ? (
        <>
          <Box
            position="relative"
            width="20px"
            height="20px"
            borderRadius="50%"
            border={`2px solid ${color}`}
            animation={`${pulse} 1.5s infinite`}
          />
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
        </>
      ) : null}

      {!props.small ? (
        <Tag colorScheme={color} borderRadius="full" px={3}>
          {props.displayText || state || 'unknown'}
        </Tag>
      ) : null}
    </Flex>
  );
}

export default Status;
