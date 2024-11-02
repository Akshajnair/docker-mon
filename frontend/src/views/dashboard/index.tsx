import { Box } from '@chakra-ui/react';
import ProjectList from './ProjectList';
export default function Dashboard() {

    return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <ProjectList />
    </Box>
}