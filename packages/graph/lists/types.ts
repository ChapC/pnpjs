import { List as IListEntity } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphPost } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { body } from "@pnp/queryable";

/**
 * Represents a list entity
 */
@deleteable()
@updateable()
export class _List extends _GraphInstance<IListEntity> { }
export interface IList extends _List, IDeleteable, IUpdateable { }
export const List = graphInvokableFactory<IList>(_List);

/**
 * Describes a collection of list objects
 *
 */
@defaultPath("lists")
@getById(List)
export class _Lists extends _GraphCollection<IListEntity[]>{
    /**
     * Create a new list as specified in the request body.
     *
     * @param list  a JSON representation of a List object.
     */
    public async add(list: IListEntity): Promise<IListAddResult> {
        const data = await graphPost(this, body(list));

        return {
            data,
            list: (<any>this).getById(data.id),
        };
    }
}

export interface ILists extends _Lists, IGetById<IList> { }
export const Lists = graphInvokableFactory<ILists>(_Lists);

/**
 * IListAddResult
 */
export interface IListAddResult {
    list: IList;
    data: IListEntity;
}
