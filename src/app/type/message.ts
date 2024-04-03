import { Tag } from "./tag";
import { User } from "./user";

export type Message = {
    index?: number;
    text: string;
    publishDate?: Date;
    changeDate?: Date;
    owner: User;
    tagList: Tag[];
}