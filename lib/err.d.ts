export declare class Report extends Error {
    message_list: Array<string>;
    constructor(message_list: Array<string>);
    append(message: string): Report;
    prepend(message: string): Report;
}
export declare function merge_message_list(message_list: Array<string>): string;
