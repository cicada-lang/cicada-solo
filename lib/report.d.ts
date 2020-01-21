export declare class Report extends Error {
    message_list: Array<string>;
    constructor(message_list: Array<string>);
    throw_append(message: string): void;
    throw_prepend(message: string): void;
}
