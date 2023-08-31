import { hOP, stringIsNullOrEmpty, TimelinePipe } from "@pnp/core";
import { errorCheck, parseODataJSON } from "@pnp/queryable";
import { GraphCollection, IGraphQueryable, IGraphCollection } from "../graphqueryable.js";
import { ConsistencyLevel } from "./consistency-level.js";

export interface IPagedResult {
    count: number;
    value: any | any[] | null;
    hasNext: boolean;
    nextLink: string;
}

/**
 * A function that will take a collection defining IGraphCollection and return the count of items
 * in that collection. Not all Graph collections support Count.
 *
 * @param col The collection to count
 * @returns number representing the count
 */
export async function Count<T>(col: IGraphCollection<T>): Promise<number> {

    const q = GraphCollection(col).using(Paged(), ConsistencyLevel());
    q.query.set("$count", "true");
    q.top(1);

    const y: IPagedResult = await q();
    return y.count;
}

/**
 * Behavior that converts results to pages when used with a collection (exposed through the paged method of GraphCollection)
 *
 * @returns A TimelinePipe used to configure the queryable
 */
export function Paged(): TimelinePipe {

    return (instance: IGraphQueryable) => {

        instance.on.parse.replace(errorCheck);
        instance.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            const txt = await response.text();
            const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
            const nextLink = json["@odata.nextLink"];

            const count = hOP(json, "@odata.count") ? parseInt(json["@odata.count"], 10) : -1;

            const hasNext = !stringIsNullOrEmpty(nextLink);

            result = {
                count,
                hasNext,
                nextLink: hasNext ? nextLink : null,
                value: parseODataJSON(json),
            };

            return [url, response, result];
        });

        return instance;
    };
}
