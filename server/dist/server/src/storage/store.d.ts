import { AppData } from "../../../shared/types";
declare class Store {
    private data;
    constructor();
    private load;
    private write;
    save(): void;
    getData(): AppData;
}
export declare const store: Store;
export {};
