
//#region src/lib/client.ts
var Client = class Client {
	api;
	cookies = [];
	options;
	constructor(api, options) {
		if (typeof api === "string") this.api = new URL(api);
		else this.api = api;
		this.options = options || {};
	}
	static formData(params) {
		return Object.entries(params).reduce((form, [key, value]) => {
			form.set(key, value);
			return form;
		}, new FormData());
	}
	static searchParams(params) {
		return Object.entries(params).reduce((result, [key, value]) => {
			if (Array.isArray(value)) value = value.join("|");
			switch (typeof value) {
				case "string":
					result.set(key, value);
					break;
				case "boolean":
					result.set(key, value ? "1" : "0");
					break;
				default: result.set(key, `${value}`);
			}
			return result;
		}, new URLSearchParams());
	}
	async get(params, options) {
		const searchParams = Client.searchParams(params);
		return (await this.request(`${this.api}?${searchParams}`, options)).json();
	}
	async post(params, options = {}) {
		let body;
		switch (options.headers["content-type"]) {
			case "application/x-www-form-urlencoded":
				body = Client.searchParams(params);
				break;
			case "multipart/form-data":
				body = Client.formData(params);
				break;
			default:
				body = JSON.stringify(params);
				break;
		}
		options = Object.assign({}, options, {
			body,
			method: "post"
		});
		return (await this.request(this.api, options)).json();
	}
	async request(url, options = {}) {
		const headers = Object.assign({}, this.options.headers || {}, options.headers || {}, { cookie: this.cookies.join(",") });
		options = Object.assign({}, options, { headers });
		const req = await fetch(url, options);
		this.cookies = this.cookies.concat(req.headers.getSetCookie());
		return req;
	}
};

//#endregion
//#region src/lib/wiki.ts
var Wiki = class {
	client;
	cachedTokens = {};
	constructor(url, options) {
		this.client = new Client(url, options);
	}
	async action(params, options = {}) {
		const defaults = {
			format: "json",
			formatversion: 2
		};
		if (!options.token) defaults.token = await this.csrfToken();
		params = Object.assign(options, defaults, params);
		return await this.client.post(params);
	}
	/**
	* Enumerate all categories.
	* @see https://www.mediawiki.org/wiki/API:Allcategories
	*/
	allcategories(params) {
		return this.query(params, { list: "allcategories" });
	}
	/**
	* List all deleted revisions by a user or in a namespace.
	* @see https://www.mediawiki.org/wiki/API:Alldeletedrevisions
	*/
	alldeletedrevisions(params) {
		return this.query(params, { list: "alldeletedrevisions" });
	}
	/**
	* List all file usages, including non-existing.
	* @see https://www.mediawiki.org/wiki/API:Allfileusages
	*/
	allfileusages(params) {
		return this.query(params, { list: "allfileusages" });
	}
	/**
	* Enumerate all images sequentially.
	* @see https://www.mediawiki.org/wiki/API:Allimages
	*/
	allimages(params) {
		return this.query(params, { list: "allimages" });
	}
	/**
	* Enumerate all links that point to a given namespace.
	* @see https://www.mediawiki.org/wiki/API:Alllinks
	*/
	alllinks(params) {
		return this.query(params, { list: "alllinks" });
	}
	/**
	* Returns messages from the site.
	* @see https://www.mediawiki.org/wiki/API:Allmessages
	*/
	async allmessages(params) {
		return (await this.query(params, { meta: "allmessages" })).query.allmessages;
	}
	/**
	* Enumerate all pages sequentially in a given namespace.
	* @see https://www.mediawiki.org/wiki/API:Allpages
	*/
	allpages(params) {
		return this.query(params, { list: "allpages" });
	}
	/**
	* List all redirects to a namespace.
	* @see https://www.mediawiki.org/wiki/API:Allredirects
	*/
	allredirects(params) {
		return this.query(params, { list: "allredirects" });
	}
	/**
	* List all revisions.
	* @see https://www.mediawiki.org/wiki/API:Allrevisions
	*/
	allrevisions(params) {
		return this.query(params, { list: "allrevisions" });
	}
	/**
	* List all transclusions (pages embedded using `{{x}}`), including non-existing.
	* @see https://www.mediawiki.org/wiki/API:Alltransclusions
	*/
	alltransclusions(params) {
		return this.query(params, { list: "alltransclusions" });
	}
	/**
	* Enumerate all registered users.
	* @see https://www.mediawiki.org/wiki/API:Allusers
	*/
	allusers(params) {
		return this.query(params, { list: "allusers" });
	}
	/**
	* Find all pages that link to the given page.
	* @see https://www.mediawiki.org/wiki/API:Backlinks
	*/
	backlinks(params) {
		return this.query(params, { list: "backlinks" });
	}
	/**
	* Block a user.
	*/
	async block(params) {
		return (await this.action(params, { action: "block" })).block;
	}
	/**
	* List all blocked users and IP addresses.
	* @see https://www.mediawiki.org/wiki/API:Blocks
	*/
	blocks(params) {
		return this.query(params, { list: "blocks" });
	}
	/**
	* List all categories the pages belong to.
	* @see https://www.mediawiki.org/wiki/API:Categories
	*/
	categories(params) {
		return this.query(params, { prop: "categories" });
	}
	/**
	* Returns information about the given categories.
	* @see https://www.mediawiki.org/wiki/API:Categoryinfo
	*/
	categoryinfo(params) {
		return this.query(params, { prop: "categoryinfo" });
	}
	/**
	* List all pages in a given category.
	* @see https://www.mediawiki.org/wiki/API:Categorymembers
	*/
	categorymembers(params) {
		return this.query(params, { list: "categorymembers" });
	}
	/**
	* Get the list of logged-in contributors (including temporary users) and the count of
	* logged-out contributors to a page.
	* @see https://www.mediawiki.org/wiki/API:Contributors
	*/
	contributors(params) {
		return this.query(params, { prop: "contributors" });
	}
	async csrfToken(force = false) {
		return (await this.tokens("csrf", force)).csrftoken;
	}
	/**
	* Get deleted revision information.
	* @see https://www.mediawiki.org/wiki/API:Deletedrevisions
	*/
	deletedrevisions(params) {
		return this.query(params, { prop: "deletedrevisions" });
	}
	/**
	* List all files that are duplicates of the given files based on hash values.
	* @see https://www.mediawiki.org/wiki/API:Duplicatefiles
	*/
	duplicatefiles(params) {
		return this.query(params, { prop: "duplicatefiles" });
	}
	/**
	* Create and edit pages.
	*/
	async edit(params) {
		return (await this.action(params, {
			action: "edit",
			assert: params.bot ? "bot" : "user"
		})).edit;
	}
	/**
	* Find all pages that embed (transclude) the given title.
	* @see https://www.mediawiki.org/wiki/API:Embeddedin
	*/
	embeddedin(params) {
		return this.query(params, { list: "embeddedin" });
	}
	/**
	* Returns all external URLs (not interwikis) from the given pages.
	* @see https://www.mediawiki.org/wiki/API:Extlinks
	*/
	extlinks(params) {
		return this.query(params, { prop: "extlinks" });
	}
	/**
	* Enumerate pages that contain a given URL.
	* @see https://www.mediawiki.org/wiki/API:Exturlusage
	*/
	exturlusage(params) {
		return this.query(params, { list: "exturlusage" });
	}
	/**
	* Enumerate all deleted files sequentially.
	* @see https://www.mediawiki.org/wiki/API:Filearchive
	*/
	filearchive(params) {
		return this.query(params, { list: "filearchive" });
	}
	/**
	* Return meta information about image repositories configured on the wiki.
	* @see https://www.mediawiki.org/wiki/API:Filerepoinfo
	*/
	async filerepoinfo(params) {
		return (await this.query(params, { meta: "filerepoinfo" })).query.repos;
	}
	/**
	* Find all pages that use the given files.
	* @see https://www.mediawiki.org/wiki/API:Fileusage
	*/
	fileusage(params) {
		return this.query(params, { prop: "fileusage" });
	}
	/**
	* Get the list of pages to work on by executing the specified query module.
	* @see https://www.mediawiki.org/wiki/API:Query#Generators
	*/
	generate(params) {
		return this.query(params);
	}
	/**
	* Returns global image usage for a certain image.
	* @see https://www.mediawiki.org/wiki/API:Globalusage
	*/
	globalusage(params) {
		return this.query(params, { prop: "globalusage" });
	}
	/**
	* Returns file information and upload history.
	* @see https://www.mediawiki.org/wiki/API:Imageinfo
	*/
	imageinfo(params) {
		return this.query(params, { prop: "imageinfo" });
	}
	/**
	* Return all files contained on the given pages.
	* @see https://www.mediawiki.org/wiki/API:Images
	*/
	images(params) {
		return this.query(params, { prop: "images" });
	}
	/**
	* Find all pages that use the given image title.
	* @see https://www.mediawiki.org/wiki/API:Imageusage
	*/
	imageusage(params) {
		return this.query(params, { list: "imageusage" });
	}
	/**
	* Get basic page information.
	* @see https://www.mediawiki.org/wiki/API:Info
	*/
	info(params) {
		return this.query(params, { prop: "info" });
	}
	/**
	* Find all pages that link to the given interwiki link.
	* Can be used to find all links with a prefix, or all links to a title (with a given prefix).
	* Using neither parameter is effectively "all interwiki links".
	* @see https://www.mediawiki.org/wiki/API:Iwbacklinks
	*/
	iwbacklinks(params) {
		return this.query(params, { list: "iwbacklinks" });
	}
	/**
	* Returns all interwiki links from the given pages.
	* @see https://www.mediawiki.org/wiki/API:Iwlinks
	*/
	iwlinks(params) {
		return this.query(params, { prop: "iwlinks" });
	}
	/**
	* Find all pages thast link to the given language link.
	* Can be used to find all links with a language code, or all links to a title (with a given language).
	* Using neither parameter is effectively "all language links".
	* @see https://www.mediawiki.org/wiki/API:Langbacklinks
	*/
	langbacklinks(params) {
		return this.query(params, { list: "langbacklinks" });
	}
	/**
	* Returns all interlanguage links from the given pages.
	* @see https://www.mediawiki.org/wiki/API:Langlinks
	*/
	langlinks(params) {
		return this.query(params, { prop: "langlinks" });
	}
	/**
	* Returns all links from the given pages.
	* @see https://www.mediawiki.org/wiki/API:Links
	*/
	links(params) {
		return this.query(params, { prop: "links" });
	}
	/**
	* Find all pages that link to the given pages.
	* @see https://www.mediawiki.org/wiki/API:Linkshere
	*/
	linkshere(params) {
		return this.query(params, { prop: "linkshere" });
	}
	/**
	* Get events from logs.
	* @see https://www.mediawiki.org/wiki/API:Logevents
	*/
	logevents(params) {
		return this.query(params, { list: "logevents" });
	}
	/**
	* Log in and get authentication tokens.
	*
	* This action should only be used in combination with Special:BotPasswords.
	*
	* This will modify your "Wiki" instance, and all next requests will be authenticated.
	* @see https://www.mediawiki.org/wiki/API:Login
	*/
	async login(username, password) {
		const tokens = await this.tokens("login");
		const params = {
			action: "login",
			format: "json",
			formatversion: "2",
			lgname: username,
			lgpassword: password,
			lgtoken: tokens.logintoken
		};
		return (await this.client.post(params, { headers: { "content-type": "application/x-www-form-urlencoded" } })).login;
	}
	/**
	* Log out and clear session data.
	*/
	async logout() {
		const params = {
			action: "logout",
			token: await this.csrfToken()
		};
		await this.client.post(params, { headers: { "content-type": "application/x-www-form-urlencoded" } });
	}
	/**
	* List all page property names in use on the wiki.
	* @see https://www.mediawiki.org/wiki/API:Pagepropnames
	*/
	pagepropnames(params) {
		return this.query(params, { list: "pagepropnames" });
	}
	/**
	* Get various page properties defined in the page content.
	* @see https://www.mediawiki.org/wiki/API:Pageprops
	*/
	pageprops(params) {
		return this.query(params, { prop: "pageprops" });
	}
	/**
	* List all pages using a given page property.
	* @see https://www.mediawiki.org/wiki/API:Pageswithprop
	*/
	pageswithprop(params) {
		return this.query(params, { list: "pageswithprop" });
	}
	/**
	* Perform a prefix search for page titles.
	* @see https://www.mediawiki.org/wiki/API:Prefixsearch
	*/
	prefixsearch(params) {
		return this.query(params, { list: "prefixsearch" });
	}
	/**
	* List all titles protected from creation.
	* @see https://www.mediawiki.org/wiki/API:Protectedtitles
	*/
	protectedtitles(params) {
		return this.query(params, { list: "protectedtitles" });
	}
	async query(params, options = {}) {
		options = Object.assign(options, {
			action: "query",
			format: "json",
			formatversion: 2
		});
		params = Object.assign(options, params);
		return await this.client.get(params);
	}
	/**
	* Get a list provided by a QueryPage-based special page.
	* @see https://www.mediawiki.org/wiki/API:Querypage
	*/
	querypage(params) {
		return this.query(params, { list: "querypage" });
	}
	/**
	* Get a set of random pages.
	* @see https://www.mediawiki.org/wiki/API:Random
	*/
	random(params) {
		return this.query(params, { list: "random" });
	}
	/**
	* Enumerate recent changes.
	* @see https://www.mediawiki.org/wiki/API:Recentchanges
	*/
	recentchanges(params) {
		return this.query(params, { list: "recentchanges" });
	}
	/**
	* Returns all redirects to the given pages.
	* @see https://www.mediawiki.org/wiki/API:Redirects
	*/
	redirects(params) {
		return this.query(params, { prop: "redirects" });
	}
	/**
	* Get revision information.
	* @see https://www.mediawiki.org/wiki/API:Revisions
	*/
	revisions(params) {
		return this.query(params, { prop: "revisions" });
	}
	/**
	* Perform a full text search.
	* @see https://www.mediawiki.org/wiki/API:Search
	*/
	search(params) {
		return this.query(params, { list: "search" });
	}
	/**
	* Return general information about the site.
	* @see https://www.mediawiki.org/wiki/API:Siteinfo
	*/
	async siteinfo(params) {
		return (await this.query(params, { meta: "siteinfo" })).query;
	}
	/**
	* List change tags.
	* @see https://www.mediawiki.org/wiki/API:Tags
	*/
	tags(params) {
		return this.query(params, { list: "tags" });
	}
	/**
	* Returns all pages transcluded on the given pages.
	* @see https://www.mediawiki.org/wiki/API:Templates
	*/
	templates(params) {
		return this.query(params, { prop: "templates" });
	}
	/**
	* Gets tokens for data-modifying actions.
	* @see https://www.mediawiki.org/wiki/API:Tokens
	*/
	async tokens(tokenType, force = false) {
		if (!force && typeof tokenType === "string" && this.cachedTokens[tokenType]) return { [`${tokenType}token`]: this.cachedTokens[tokenType] };
		let type;
		if (Array.isArray(tokenType)) type = tokenType.join("|");
		else type = tokenType;
		return (await this.client.get({
			action: "query",
			format: "json",
			formatversion: "2",
			meta: "tokens",
			type
		})).query.tokens;
	}
	/**
	* Find all pages that transclude the given pages.
	* @see https://www.mediawiki.org/wiki/API:Transcludedin
	*/
	transcludedin(params) {
		return this.query(params, { prop: "transcludedin" });
	}
	/**
	* Unblock a user.
	*/
	async unblock(params) {
		return (await this.action(params, { action: "unblock" })).unblock;
	}
	/**
	* Upload a file, or get the status of pending uploads.
	*/
	async upload(params) {
		const defaults = {
			action: "upload",
			format: "json",
			formatversion: 2,
			token: await this.csrfToken()
		};
		params = Object.assign(defaults, params);
		return await this.client.post(params, { headers: { "content-type": "multipart/form-data" } });
	}
	/**
	* Get all edits by a user.
	* @see https://www.mediawiki.org/wiki/API:Usercontribs
	*/
	usercontribs(params) {
		return this.query(params, { list: "usercontribs" });
	}
	/**
	* Get information about the current user.
	* @see https://www.mediawiki.org/wiki/API:Userinfo
	*/
	async userinfo(params) {
		return (await this.query(params, { meta: "userinfo" })).query.userinfo;
	}
	/**
	* Change a user's group membership.
	*/
	async userrights(params) {
		const token = await this.tokens("userrights");
		return (await this.action(params, {
			action: "userrights",
			token: token.userrightstoken
		})).userrights;
	}
	/**
	* Get information about a list of users.
	* @see https://www.mediawiki.org/wiki/API:Users
	*/
	users(params) {
		return this.query(params, { list: "users" });
	}
	/**
	* Get recent changes to pages in the current user's watchlist.
	* @see https://www.mediawiki.org/wiki/API:Watchlist
	*/
	watchlist(params) {
		return this.query(params, { list: "watchlist" });
	}
	/**
	* Get all pages on the current user's watchlist.
	* @see https://www.mediawiki.org/wiki/API:Watchlistraw
	*/
	watchlistraw(params) {
		return this.query(params, { list: "watchlistraw" });
	}
};

//#endregion
exports.Client = Client;
exports.Wiki = Wiki;
//# sourceMappingURL=main.cjs.map