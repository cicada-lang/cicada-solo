export declare class Report extends Error {
    message_list: Array<string>;
    constructor(message_list: Array<string>);
    append(message: string): void;
    prepend(message: string): void;
}
