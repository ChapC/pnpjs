import {
    SPRest,
    Web,
    Site,
    SharePointQueryable,
    SharePointQueryableConstructor,
} from "@pnp/sp";

import {
    Util,
    UrlException,
} from "@pnp/common";

export class SPRestAddIn extends SPRest {

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): Site {
        return this._cdImpl(Site, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web {
        return this._cdImpl(Web, addInWebUrl, hostWebUrl, "web");
    }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends SharePointQueryable>(
        factory: SharePointQueryableConstructor<T>,
        addInWebUrl: string,
        hostWebUrl: string,
        urlPart: string): T {

        if (!Util.isUrlAbsolute(addInWebUrl)) {
            throw new UrlException("The addInWebUrl parameter must be an absolute url.");
        }

        if (!Util.isUrlAbsolute(hostWebUrl)) {
            throw new UrlException("The hostWebUrl parameter must be an absolute url.");
        }

        const url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)");

        const instance = new factory(url, urlPart);
        instance.query.add("@target", "'" + encodeURIComponent(hostWebUrl) + "'");
        return instance.configure(this._options);
    }
}

export const sp = new SPRestAddIn();
