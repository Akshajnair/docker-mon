export interface IBuildConfig {
    context: string;
    dockerfile?: string;
    args?: { [key: string]: string };
    target?: string;
}