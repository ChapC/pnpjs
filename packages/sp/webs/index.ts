import { Web } from "./types.js";
import { SPRest } from "../rest.js";
import { Queryable } from "@pnp/queryable";

export {
    IWeb,
    IWebs,
    Web,
    IWebAddResult,
    IWebUpdateResult,
    Webs,
    IWebInfo,
    IStorageEntity,
    IWebInfosData,
} from "./types.js";

declare module "../rest" {
    interface SPRest {

        /**
         * Access to the current web instance
         */
        readonly web: ReturnType<typeof Web>;

        /**
         * Creates a batch behavior and associated execute function
         *
         */
        createBatch(): [(instance: Queryable) => Queryable, () => Promise<void>];
    }
}

Reflect.defineProperty(SPRest.prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.create(Web);
    },
});

SPRest.prototype.createBatch = function (this: SPRest): [(instance: Queryable) => Queryable, () => Promise<void>] {
    return this.web.createBatch();
};
