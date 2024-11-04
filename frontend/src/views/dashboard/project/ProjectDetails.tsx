import React, { useEffect, useState } from 'react';
import { useGetProjectDetailsQuery } from 'reducers/api/ProjectApiReducer';
import Card from 'components/card/Card';
import {
  Box,
  Flex,
  Icon,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdCancel,
  MdCheckCircle,
  MdOutlineCalendarToday,
  MdOutlineError,
} from 'react-icons/md';
import { PiShippingContainerDuotone } from 'react-icons/pi';
import IconBox from 'components/icons/IconBox';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Status from 'components/status/Status';
import { useGetStatusQuery } from 'reducers/api/DockerApiReducer';

function ProjectDetails({ projectFolderName }: { projectFolderName: string }) {
  const { data: projectDetails, isSuccess } =
    useGetProjectDetailsQuery(projectFolderName);
  const { data: statuses } = useGetStatusQuery();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const a = {
    name: 'immich app',
    folderName: 'immich-app',
    dockerCompose: {
      services: {
        'immich-server': {
          image: 'ghcr.io/immich-app/immich-server:${IMMICH_VERSION:-release}',
          container_name: 'immich_server',
          volumes: [
            '${UPLOAD_LOCATION}:/usr/src/app/upload',
            '/etc/localtime:/etc/localtime:ro',
          ],
          ports: ['2283:2283'],
          depends_on: ['redis', 'database'],
          networks: {
            'Orion-DN-1': {
              ipv4_address: '172.26.0.7',
            },
          },
          restart: 'always',
        },
        'immich-machine-learning': {
          image:
            'ghcr.io/immich-app/immich-machine-learning:${IMMICH_VERSION:-release}',
          container_name: 'immich_machine_learning',
          volumes: ['model-cache:/cache'],
          networks: {
            'Orion-DN-1': {
              ipv4_address: '172.26.0.9',
            },
          },
          restart: 'always',
        },
        redis: {
          image:
            'redis:6.2-alpine@sha256:70a7a5b641117670beae0d80658430853896b5ef269ccf00d1827427e3263fa3',
          container_name: 'immich_redis',
          networks: {
            'Orion-DN-1': {
              ipv4_address: '172.26.0.10',
            },
          },
          restart: 'always',
          healthcheck: {
            test: 'redis-cli ping || exit 1',
          },
        },
        database: {
          image:
            'tensorchord/pgvecto-rs:pg14-v0.2.0@sha256:90724186f0a3517cf6914295b5ab410db9ce23190a2d9d0b9dd6463e3fa298f0',
          container_name: 'immich_postgres',
          volumes: ['${DB_DATA_LOCATION}:/var/lib/postgresql/data'],
          environment: {
            POSTGRES_PASSWORD: '${DB_PASSWORD}',
            POSTGRES_USER: '${DB_USERNAME}',
            POSTGRES_DB: '${DB_DATABASE_NAME}',
          },
          networks: {
            'Orion-DN-1': {
              ipv4_address: '172.26.0.11',
            },
          },
          restart: 'always',
          healthcheck: {
            test: "pg_isready --dbname='${DB_DATABASE_NAME}' --username='${DB_USERNAME}' || exit 1; Chksum=\"$$(psql --dbname='${DB_DATABASE_NAME}' --username='${DB_USERNAME}' --tuples-only --no-align --command='SELECT COALESCE(SUM(checksum_failures), 0) FROM pg_stat_database')\"; echo \"checksum failure count is $$Chksum\"; [ \"$$Chksum\" = '0' ] || exit 1",
            interval: '5m',
            start_period: '5m',
          },
        },
      },
      volumes: {
        'model-cache': {},
      },
      networks: {
        'Orion-DN-1': {
          external: true,
        },
      },
    },
  };
  type RowObj = {
    name: string;
    state: string;
    status?: string;
    containerId: string;
    action: string;
  };
  const columnHelper = createColumnHelper<RowObj>();
  const [data, setData] = useState<RowObj[]>([]);

  useEffect(() => {
    if (isSuccess) {
      setData(
        Object.entries(projectDetails.dockerCompose.services).map(
          ([name, config]) => {
            const containerStatus = statuses.find(
              (x) => x.name === config.container_name,
            );
            return {
              name: name,
              state: containerStatus?.state,
              status: containerStatus?.status,
              containerId: containerStatus?.containerId,
              action: '',
            };
          },
        ),
      );
    }
  }, [projectDetails]);

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          NAME
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('state', {
      id: 'state',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          STATUS
        </Text>
      ),
      cell: (info) => {
        console.log(info, info.row.getValue('status'));
        return (
          <Flex align="center">
            <Status
              state={info.getValue()}
              displayText={info.row.original.status}
            />
          </Flex>
        );
      },
    }),
    // columnHelper.accessor('date', {
    //   id: 'date',
    //   header: () => (
    //     <Text
    //       justifyContent="space-between"
    //       align="center"
    //       fontSize={{ sm: '10px', lg: '12px' }}
    //       color="gray.400"
    //     >
    //       DATE
    //     </Text>
    //   ),
    //   cell: (info) => (
    //     <Text color={textColor} fontSize="sm" fontWeight="700">
    //       {info.getValue()}
    //     </Text>
    //   ),
    // }),
    columnHelper.accessor('action', {
      id: 'action',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ACTION
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          {/* <Progress
            variant="table"
            colorScheme="brandScheme"
            h="8px"
            w="108px"
            value={info.getValue()}
          /> */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });
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
          <Table variant="simple" color="gray.500" mb="24px" mt="12px" w="100%">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: '',
                            desc: '',
                          }[header.column.getIsSorted() as string] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table
                .getRowModel()
                .rows.slice(0, 5)
                .map((row) => {
                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                            borderColor="transparent"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </div>
  );
}

export default ProjectDetails;
