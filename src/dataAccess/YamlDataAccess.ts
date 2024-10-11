
import fs from 'fs';
import NotFoundError from '../errors/NotFoundError';
import * as yaml from 'js-yaml';
import DockerCompose from '../models/DockerCompose';
import IDockerCompose from '../models/interface/IDockerCompose';


function getProjectYaml(yamlLocation: string): DockerCompose {
    if (fs.existsSync(yamlLocation)) {
        const fileContents = fs.readFileSync(yamlLocation, 'utf8');
        const data = yaml.load(fileContents) as DockerCompose;
        return new DockerCompose(data.services, data.volumes, data.networks);
    }
    throw new NotFoundError("Yaml not found.");
};

function updateProjectYaml(yamlLocation: string, updatedDockerCompose: IDockerCompose): void {
    if (fs.existsSync(yamlLocation)) {
        const yamlStr = yaml.dump(updatedDockerCompose);
        fs.writeFileSync(yamlLocation, yamlStr, 'utf8');
    }
    throw new NotFoundError("Yaml not found.");
};

export { getProjectYaml, updateProjectYaml }