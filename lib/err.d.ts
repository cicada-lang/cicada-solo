export declare class Report extends Error {
    message_list: Array<string>;
    constructor(message_list: Array<string>);
    append(message: string): Report;
    prepend(message: string): Report;
}
