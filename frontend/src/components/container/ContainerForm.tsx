import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import InputField from 'components/fields/InputField';
import MultiStringInputField from 'components/fields/MultiStringInputField';
import RadioInputField from 'components/fields/RadioInputField';

type ContainerFormProps = {
  projectName: string;
};
export default function ContainerForm(props: ContainerFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State to handle form input values
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    build: '',
    container_name: '',
    volumes: [],
    ports: [],
    environment: '',
    depends_on: [],
    networks: '',
    restart: 'no',
    healthcheck: '',
    logging: '',
  });

  function handleChange(e: any) {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      container_name: props.projectName + '_' + formData.name,
    }));
  }

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(formData); // Handle form submission logic here
  // };

  function saveAndRestart() {
    console.log(formData);
  }

  function save() {
    console.log(formData);
  }

  return (
    <>
      <Button colorScheme="green" variant="outline" onClick={onOpen}>
        <RiEdit2Fill />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" margin="0 auto" p="4">
              <form>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2, '2xl': 2 }}
                  gap="20px"
                  mb="20px"
                >
                  <InputField
                    id="name"
                    label="Name"
                    placeholder="e.g., my_container"
                    type="text"
                    mb="0"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <InputField
                    id="containerName"
                    label="Container Name"
                    type="text"
                    mb="0"
                    value={props.projectName + '_' + formData.name}
                    disabled
                  />
                  <InputField
                    id="image"
                    label="Image"
                    placeholder="e.g., node:latest"
                    type="text"
                    mb="0"
                    value={formData.image}
                    onChange={handleChange}
                  />

                  <InputField
                    id="build"
                    label="Build Config"
                    placeholder="e.g., ./Dockerfile"
                    type="text"
                    mb="0"
                    value={formData.build}
                    onChange={handleChange}
                  />

                  <MultiStringInputField
                    id="volumes"
                    label="Volumes"
                    placeholder="e.g., /app:/app"
                    type="text"
                    mb="0"
                    value={formData.volumes}
                    onChange={handleChange}
                  />

                  <MultiStringInputField
                    id="ports"
                    label="Ports"
                    placeholder="e.g., 8080:80"
                    type="text"
                    mb="0"
                    value={formData.ports}
                    onChange={handleChange}
                  />

                  <MultiStringInputField
                    id="depends_on"
                    label="Depends On"
                    placeholder="e.g., db, redis"
                    type="text"
                    mb="0"
                    value={formData.depends_on}
                    onChange={handleChange}
                  />

                  <RadioInputField
                    id="restart"
                    label="Restart"
                    value={formData.restart}
                    onChange={handleChange}
                    options={[
                      { title: 'No', value: 'no' },
                      { title: 'Always', value: 'always' },
                      { title: 'On failure', value: 'on-failure' },
                      { title: 'Unless stopped', value: 'unless-stopped' },
                    ]}
                  />
                </SimpleGrid>

                <Flex justifyContent="end" w="100%" mt={10}>
                  <Button colorScheme="green" mr={3} onClick={saveAndRestart}>
                    Save and restart
                  </Button>
                  <Button colorScheme="teal" mr={3} onClick={save}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </Flex>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
