import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGetProjectsQuery } from 'reducers/api/ProjectApiReducer';
import Loader from 'components/loader/Loader';
import Card from 'components/card/Card';
import { capitalizeAfterSpace } from 'shared/utils/StringUtils';
import Status from 'components/status/Status';
import ProjectDetails from './ProjectDetails';
import { useState } from 'react';

export default function ProjectList() {
  const { data: projects, error, isLoading } = useGetProjectsQuery();
  const [openProjectFolderName, setopenProjectFolderName] = useState('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <SimpleGrid columns={{ base: 1 }} gap="20px" mb="20px">
      <Card
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
            Projects
          </Text>
        </Flex>
        <Box px="25px" mt="20px">
          <Loader
            isLoading={isLoading}
            error={error}
            errorMsg="Oops! could not load Projects."
          >
            <Accordion
              allowToggle
              onChange={(index) => {
                if (typeof index === 'number' && index >= 0)
                  setopenProjectFolderName(projects?.[index].folderName);
                else setopenProjectFolderName('');
              }}
            >
              {projects?.map((project) => {
                return (
                  <AccordionItem key={project.folderName}>
                    <h2>
                      <AccordionButton fontSize="24px">
                        <Box flex="1" textAlign="left">
                          {capitalizeAfterSpace(project.name)}
                        </Box>
                        <Status project={project} />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {openProjectFolderName ? (
                        <ProjectDetails
                          projectFolderName={openProjectFolderName}
                        />
                      ) : null}
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Loader>
        </Box>
      </Card>
    </SimpleGrid>
  );
}
