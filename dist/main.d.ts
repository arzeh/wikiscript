//#region src/lib/client.d.ts
declare class Client {
  readonly api: URL;
  cookies: string[];
  readonly options: ClientOptions;
  constructor(api: URL | string, options?: ClientOptions);
  static formData(params: Record<string, unknown>): FormData;
  static searchParams(params: Record<string, unknown>): URLSearchParams;
  get<T = unknown>(params: Record<string, unknown>, options?: RequestInit): Promise<T>;
  post<T = unknown>(params: Record<string, unknown>, options?: RequestInit): Promise<T>;
  request(url: string | URL, options?: RequestInit): Promise<Response>;
}
interface ClientOptions {
  headers?: RequestInit['headers'];
}
//#endregion
//#region src/lib/wiki.d.ts
declare class Wiki {
  readonly client: Client;
  protected readonly cachedTokens: Record<string, string>;
  constructor(url: string | URL, options?: ClientOptions);
  action<T = unknown>(params: Record<string, unknown>, options?: Record<string, unknown>): Promise<T>;
  /**
    * Enumerate all categories.
    * @see https://www.mediawiki.org/wiki/API:Allcategories
    */
  allcategories(params: AllCategoriesRequest): Promise<AllCategories>;
  /**
    * List all deleted revisions by a user or in a namespace.
    * @see https://www.mediawiki.org/wiki/API:Alldeletedrevisions
    */
  alldeletedrevisions(params: AllDeletedRevisionsRequest): Promise<AllDeletedRevisions>;
  /**
    * List all file usages, including non-existing.
    * @see https://www.mediawiki.org/wiki/API:Allfileusages
    */
  allfileusages(params: AllFileUsagesRequest): Promise<AllFileUsages>;
  /**
    * Enumerate all images sequentially.
    * @see https://www.mediawiki.org/wiki/API:Allimages
    */
  allimages(params: AllImagesRequest): Promise<AllImages>;
  /**
    * Enumerate all links that point to a given namespace.
    * @see https://www.mediawiki.org/wiki/API:Alllinks
    */
  alllinks(params: AllLinksRequest): Promise<AllLinks>;
  /**
    * Returns messages from the site.
    * @see https://www.mediawiki.org/wiki/API:Allmessages
    */
  allmessages(params: AllMessagesRequest): Promise<any>;
  /**
    * Enumerate all pages sequentially in a given namespace.
    * @see https://www.mediawiki.org/wiki/API:Allpages
    */
  allpages(params: AllPagesRequest): Promise<AllPages>;
  /**
    * List all redirects to a namespace.
    * @see https://www.mediawiki.org/wiki/API:Allredirects
    */
  allredirects(params: AllRedirectsRequest): Promise<AllRedirects>;
  /**
    * List all revisions.
    * @see https://www.mediawiki.org/wiki/API:Allrevisions
    */
  allrevisions(params: AllRevisionsRequest): Promise<AllRevisions>;
  /**
    * List all transclusions (pages embedded using `{{x}}`), including non-existing.
    * @see https://www.mediawiki.org/wiki/API:Alltransclusions
    */
  alltransclusions(params: AllTransclusionsRequest): Promise<AllTransclusions>;
  /**
    * Enumerate all registered users.
    * @see https://www.mediawiki.org/wiki/API:Allusers
    */
  allusers(params: AllUsersRequest): Promise<AllUsers>;
  /**
    * Find all pages that link to the given page.
    * @see https://www.mediawiki.org/wiki/API:Backlinks
    */
  backlinks(params: BacklinksRequest): Promise<Backlinks>;
  /**
    * Block a user.
    */
  block(params: BlockRequest): Promise<any>;
  /**
    * List all blocked users and IP addresses.
    * @see https://www.mediawiki.org/wiki/API:Blocks
    */
  blocks(params: BlocksRequest): Promise<Blocks>;
  /**
    * List all categories the pages belong to.
    * @see https://www.mediawiki.org/wiki/API:Categories
    */
  categories(params: CategoriesRequest): Promise<Categories>;
  /**
    * Returns information about the given categories.
    * @see https://www.mediawiki.org/wiki/API:Categoryinfo
    */
  categoryinfo(params: CategoryInfoRequest): Promise<CategoryInfo>;
  /**
    * List all pages in a given category.
    * @see https://www.mediawiki.org/wiki/API:Categorymembers
    */
  categorymembers(params: CategoryMembersRequest): Promise<CategoryMembers>;
  /**
    * Get the list of logged-in contributors (including temporary users) and the count of
    * logged-out contributors to a page.
    * @see https://www.mediawiki.org/wiki/API:Contributors
    */
  contributors(params: ContributorsRequest): Promise<Contributors>;
  csrfToken(force?: boolean): Promise<string>;
  /**
    * Get deleted revision information.
    * @see https://www.mediawiki.org/wiki/API:Deletedrevisions
    */
  deletedrevisions(params: DeletedRevisionsRequest): Promise<DeletedRevisions>;
  /**
    * List all files that are duplicates of the given files based on hash values.
    * @see https://www.mediawiki.org/wiki/API:Duplicatefiles
    */
  duplicatefiles(params: DuplicateFilesRequest): Promise<DuplicateFiles>;
  /**
    * Create and edit pages.
    */
  edit(params: EditRequest): Promise<any>;
  /**
    * Find all pages that embed (transclude) the given title.
    * @see https://www.mediawiki.org/wiki/API:Embeddedin
    */
  embeddedin(params: EmbeddedInRequest): Promise<EmbeddedIn>;
  /**
    * Returns all external URLs (not interwikis) from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Extlinks
    */
  extlinks(params: ExtLinksRequest): Promise<ExtLinks>;
  /**
    * Enumerate pages that contain a given URL.
    * @see https://www.mediawiki.org/wiki/API:Exturlusage
    */
  exturlusage(params: ExtUrlUsageRequest): Promise<ExtUrlUsage>;
  /**
    * Enumerate all deleted files sequentially.
    * @see https://www.mediawiki.org/wiki/API:Filearchive
    */
  filearchive(params: FileArchiveRequest): Promise<FileArchive>;
  /**
    * Return meta information about image repositories configured on the wiki.
    * @see https://www.mediawiki.org/wiki/API:Filerepoinfo
    */
  filerepoinfo(params: FileRepoInfoRequest): Promise<any>;
  /**
    * Find all pages that use the given files.
    * @see https://www.mediawiki.org/wiki/API:Fileusage
    */
  fileusage(params: FileUsageRequest): Promise<FileUsage>;
  /**
    * Get the list of pages to work on by executing the specified query module.
    * @see https://www.mediawiki.org/wiki/API:Query#Generators
    */
  generate<T extends AllQueries, P extends AllProps>(params: GeneratorRequest<T, P>): Promise<GeneratorResult<P>>;
  /**
    * Returns global image usage for a certain image.
    * @see https://www.mediawiki.org/wiki/API:Globalusage
    */
  globalusage(params: GlobalUsageRequest): Promise<GlobalUsageRequest>;
  /**
    * Returns file information and upload history.
    * @see https://www.mediawiki.org/wiki/API:Imageinfo
    */
  imageinfo(params: ImageInfoRequest): Promise<ImageInfo>;
  /**
    * Return all files contained on the given pages.
    * @see https://www.mediawiki.org/wiki/API:Images
    */
  images(params: ImagesRequest): Promise<Images>;
  /**
    * Find all pages that use the given image title.
    * @see https://www.mediawiki.org/wiki/API:Imageusage
    */
  imageusage(params: ImageUsageRequest): Promise<ImageUsage>;
  /**
    * Get basic page information.
    * @see https://www.mediawiki.org/wiki/API:Info
    */
  info(params: InfoRequest): Promise<Info>;
  /**
    * Find all pages that link to the given interwiki link.
    * Can be used to find all links with a prefix, or all links to a title (with a given prefix).
    * Using neither parameter is effectively "all interwiki links".
    * @see https://www.mediawiki.org/wiki/API:Iwbacklinks
    */
  iwbacklinks(params: IwBacklinksRequest): Promise<IwBacklinks>;
  /**
    * Returns all interwiki links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Iwlinks
    */
  iwlinks(params: IwLinksRequest): Promise<IwLinks>;
  /**
    * Find all pages thast link to the given language link.
    * Can be used to find all links with a language code, or all links to a title (with a given language).
    * Using neither parameter is effectively "all language links".
    * @see https://www.mediawiki.org/wiki/API:Langbacklinks
    */
  langbacklinks(params: LangBacklinksRequest): Promise<LangBacklinks>;
  /**
    * Returns all interlanguage links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Langlinks
    */
  langlinks(params: LangLinksRequest): Promise<LangLinks>;
  /**
    * Returns all links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Links
    */
  links(params: LinksRequest): Promise<Links>;
  /**
    * Find all pages that link to the given pages.
    * @see https://www.mediawiki.org/wiki/API:Linkshere
    */
  linkshere(params: LinksHereRequest): Promise<LinksHere>;
  /**
    * Get events from logs.
    * @see https://www.mediawiki.org/wiki/API:Logevents
    */
  logevents(params: LogEventsRequest): Promise<LogEvents>;
  /**
    * Log in and get authentication tokens.
    *
    * This action should only be used in combination with Special:BotPasswords.
    *
    * This will modify your "Wiki" instance, and all next requests will be authenticated.
    * @see https://www.mediawiki.org/wiki/API:Login
    */
  login(username: string, password: string): Promise<{
    lguserid: number;
    lgusername: string;
    result: string;
  }>;
  /**
    * Log out and clear session data.
    */
  logout(): Promise<void>;
  /**
    * List all page property names in use on the wiki.
    * @see https://www.mediawiki.org/wiki/API:Pagepropnames
    */
  pagepropnames(params: PagePropNamesRequest): Promise<PagePropNames>;
  /**
    * Get various page properties defined in the page content.
    * @see https://www.mediawiki.org/wiki/API:Pageprops
    */
  pageprops(params: PagePropsRequest): Promise<PageProps>;
  /**
    * List all pages using a given page property.
    * @see https://www.mediawiki.org/wiki/API:Pageswithprop
    */
  pageswithprop(params: PagesWithPropRequest): Promise<PagesWithProp>;
  /**
    * Perform a prefix search for page titles.
    * @see https://www.mediawiki.org/wiki/API:Prefixsearch
    */
  prefixsearch(params: PrefixSearchRequest): Promise<PrefixSearch>;
  /**
    * List all titles protected from creation.
    * @see https://www.mediawiki.org/wiki/API:Protectedtitles
    */
  protectedtitles(params: ProtectedTitlesRequest): Promise<ProtectedTitles>;
  query<T = unknown>(params: Record<string, unknown>, options?: Record<string, unknown>): Promise<T>;
  /**
    * Get a list provided by a QueryPage-based special page.
    * @see https://www.mediawiki.org/wiki/API:Querypage
    */
  querypage(params: QueryPageRequest): Promise<QueryPage>;
  /**
    * Get a set of random pages.
    * @see https://www.mediawiki.org/wiki/API:Random
    */
  random(params: RandomRequest): Promise<Random>;
  /**
    * Enumerate recent changes.
    * @see https://www.mediawiki.org/wiki/API:Recentchanges
    */
  recentchanges(params: RecentChangesRequest): Promise<RecentChanges>;
  /**
    * Returns all redirects to the given pages.
    * @see https://www.mediawiki.org/wiki/API:Redirects
    */
  redirects(params: RedirectsRequest): Promise<Redirects>;
  /**
    * Get revision information.
    * @see https://www.mediawiki.org/wiki/API:Revisions
    */
  revisions(params: RevisionsRequest): Promise<Revisions>;
  /**
    * Perform a full text search.
    * @see https://www.mediawiki.org/wiki/API:Search
    */
  search(params: SearchRequest): Promise<Search>;
  /**
    * Return general information about the site.
    * @see https://www.mediawiki.org/wiki/API:Siteinfo
    */
  siteinfo(params: SiteInfoRequest): Promise<any>;
  /**
    * List change tags.
    * @see https://www.mediawiki.org/wiki/API:Tags
    */
  tags(params: TagsRequest): Promise<Tags>;
  /**
    * Returns all pages transcluded on the given pages.
    * @see https://www.mediawiki.org/wiki/API:Templates
    */
  templates(params: TemplatesRequest): Promise<Templates>;
  /**
    * Gets tokens for data-modifying actions.
    * @see https://www.mediawiki.org/wiki/API:Tokens
    */
  tokens(tokenType: '*' | Prop<TokenType>, force?: boolean): Promise<{ [k in `${TokenType}token`]?: string }>;
  /**
    * Find all pages that transclude the given pages.
    * @see https://www.mediawiki.org/wiki/API:Transcludedin
    */
  transcludedin(params: TranscludedInRequest): Promise<TranscludedIn>;
  /**
    * Unblock a user.
    */
  unblock(params: UnblockRequest): Promise<any>;
  /**
    * Upload a file, or get the status of pending uploads.
    */
  upload(params: UploadRequest): Promise<unknown>;
  /**
    * Get all edits by a user.
    * @see https://www.mediawiki.org/wiki/API:Usercontribs
    */
  usercontribs(params: UserContribsRequest): Promise<UserContribs>;
  /**
    * Get information about the current user.
    * @see https://www.mediawiki.org/wiki/API:Userinfo
    */
  userinfo(params: UserInfoRequest): Promise<any>;
  /**
    * Change a user's group membership.
    */
  userrights(params: UserRightsRequest): Promise<any>;
  /**
    * Get information about a list of users.
    * @see https://www.mediawiki.org/wiki/API:Users
    */
  users(params: UsersRequest): Promise<Users>;
  /**
    * Get recent changes to pages in the current user's watchlist.
    * @see https://www.mediawiki.org/wiki/API:Watchlist
    */
  watchlist(params: WatchlistRequest): Promise<Watchlist>;
  /**
    * Get all pages on the current user's watchlist.
    * @see https://www.mediawiki.org/wiki/API:Watchlistraw
    */
  watchlistraw(params: WatchlistRawRequest): Promise<WatchlistRaw>;
}
//#endregion
export { Client, ClientOptions, Wiki };
//# sourceMappingURL=main.d.ts.map