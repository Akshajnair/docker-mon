import { IBuildConfig } from "./interface/IBuildConfig";

export class BuildConfig implements IBuildConfig {
    context: string;
    dockerfile?: string;
    args?: { [key: string]: string };
    target?: string;

    constructor(
        context: string,
        dockerfile?: string,
        args?: { [key: string]: string },
        target?: string
    ) {
        this.context = context;
        this.dockerfile = dockerfile;
        this.args = args;
        this.target = target;
    }
}