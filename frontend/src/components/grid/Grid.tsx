import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  HeaderContext,
  useReactTable,
} from '@tanstack/react-table';
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

export type ColumnGridType<RowObj> = {
  id: keyof RowObj;
  title: string;
  headerRenderer?: (
    x: HeaderContext<RowObj, RowObj[keyof RowObj]>,
  ) => JSX.Element;
  cellRenderer?: (x: CellContext<RowObj, keyof RowObj>) => JSX.Element;
};

export type GridProps<RowObj> = {
  data: RowObj[];
  columns: ColumnGridType<RowObj>[];
};
export default function Grid<RowObj>(props: GridProps<RowObj>) {
  const columnHelper = createColumnHelper<RowObj>();

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const columns = props.columns.map((column) => {
    return columnHelper.accessor((row) => row[column.id], {
      id: column.id as string,
      header: column.headerRenderer || column.title,
      cell:
        column.cellRenderer ||
        ((x) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {x.getValue() as string}
            </Text>
          </Flex>
        )),
    });
  });

  const table = useReactTable({
    data: props.data,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });
  return (
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
  );
}
