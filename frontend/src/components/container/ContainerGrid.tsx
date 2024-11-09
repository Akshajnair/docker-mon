import { Flex, HStack } from '@chakra-ui/react';
import Grid, { ColumnGridType } from 'components/grid/Grid';
import Status from 'components/status/Status';
import Loader from 'components/loader/Loader';
import { useGetProjectDetailsQuery } from 'reducers/api/ProjectApiReducer';
import { useEffect, useState } from 'react';
import ContainerAction from './ContainerAction';
import ContainerForm from './ContainerForm';

type ContainerGridProps = { projectFolderName: string };
export default function ContainerGrid(props: ContainerGridProps) {
  const {
    data: projectDetails,
    isSuccess,
    isLoading,
    error,
  } = useGetProjectDetailsQuery(props.projectFolderName);
  const [data, setData] = useState<containerRow[]>([]);

  type containerRow = {
    name: string;
    state: string;
    containerName: string;
    action: string;
  };

  useEffect(() => {
    if (isSuccess) {
      setData(
        Object.entries(projectDetails.dockerCompose.services).map(
          ([name, config]) => {
            return {
              name: name,
              state: '',
              containerName: config.container_name,
              action: '',
            };
          },
        ),
      );
    }
  }, [projectDetails]);

  const columns: ColumnGridType<containerRow>[] = [
    {
      id: 'name',
      title: 'name',
    },
    {
      id: 'state',
      title: 'state',
      cellRenderer: (x) => (
        <Flex align="center">
          <Status containerName={x.row.original.containerName} />
        </Flex>
      ),
    },
    {
      id: 'action',
      title: 'action',
      cellRenderer: (x) => (
        <Flex align="right">
          <HStack>
            <ContainerAction containerName={x.row.original.containerName} />
            <ContainerForm projectName={props.projectFolderName} />
          </HStack>
        </Flex>
      ),
    },
  ];

  return (
    <Loader isLoading={isLoading} error={error}>
      <Grid<containerRow> columns={columns} data={data} />
    </Loader>
  );
}
