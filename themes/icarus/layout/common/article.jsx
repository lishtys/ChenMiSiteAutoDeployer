const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins,post_copyright } = config;
        const { has_thumbnail, get_thumbnail, url_for, date, date_xml, __, _p } = helper;

        const indexLaunguage = config.language || 'en';
        const language = page.lang || page.language || config.language || 'en';
        
        /* Custom */
        var use_copyright = post_copyright == undefined || post_copyright;
        var lastModified = __('article.last_modified');
         var copyrightTitle = __('article.copyright.title');
        var copyrightAuthor = __('article.copyright.author');
        var copyrightLink = __('article.copyright.link');
        var copyrightCopyrightContent = __('article.copyright.copyright_content');
        var copyrightCopyrightTitle = __('article.copyright.copyright_title');
        const copyrightPermalink = config.url + config.root + page.path;

        const words = getWordCount(page._content);
        const time = moment.duration((words / 150.0) * 60, 'seconds');
        const timeStr = time.locale(language).humanize().replace('a few seconds', 'fast').replace('hours', 'h').replace('minutes', 'm').replace('seconds', 's').replace('days', 'd');
        const wordsCount = (words / 1000.0).toFixed(1);

        return <Fragment>
            {/* Main content */}
            <div class="card">
                {/* Thumbnail */}
                {has_thumbnail(page) ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by3">
                        <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </a> : <span class="image is-7by3">
                        <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </span>}
                </div> : null}
                {/* Metadata */}
                <article class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {page.layout !== 'page' ? <div class="article-meta size-small is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* Date */}
                            <i class="far fa-calendar-plus">&nbsp;</i>{date(page.date)}&nbsp;&nbsp;
                            {/* Categories */}

                            {/* Read time */}
                            {article && article.readtime && article.readtime === true ? <span class="level-item">
                                <i class="far fa-clock">&nbsp;</i>{timeStr} &nbsp;<i class="fas fa-pencil-alt">&nbsp;</i>{wordsCount}&nbsp;k
                                </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: '<i class="far fa-eye"></i>' + _p('plugin.visit', '&nbsp;&nbsp;<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    <h1 class="title is-3 is-size-4-mobile">
                        {index ? <a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {index ? <div class="index-category-tag">
                    {/* categories */}
                    {page.categories && page.categories.length ? <div class="level-item">
                            {(() => {
                                const categories = [];
                                categories.push(<i class="fas fa-folder-open has-text-grey">&nbsp;</i>)
                                page.categories.forEach((category, i) => {
                                    categories.push(<a class="article-more button is-small link-muted index-categories" href={url_for(category.path)}>{category.name}</a>);
                                    if (i < page.categories.length - 1) {
                                        categories.push(<span>&nbsp;</span>);
                                    }
                                });
                                return categories;
                            })()}
                        </div> : null}
                        &nbsp;&nbsp;
                    {/* Tags */}
                    {page.tags && page.tags.length ?
                            <div class="level-item">
                                {(() => {
                                    const tags = [];
                                    tags.push(<i class="fas fa-tags has-text-grey">&nbsp;</i>)
                                    page.tags.forEach((tag, i) => {
                                        tags.push(<a class="article-more button is-small link-muted index-tags" href={url_for(tag.path)}>{tag.name}</a>);
                                        if (i < page.tags.length - 1) {
                                            tags.push(<span>&nbsp;</span>);
                                        }
                                    });
                                    return tags;
                                })()}
                            </div> : null}
                            <hr />
                    </div> : null}
                    {/* "Read more" button */}
                    {index && page.excerpt ?
                    <div class="level is-mobile is-flex">
                    <div class="level-start">
                    <div class="level-item">
                        <a class="article-more button is-small size-small" href={`${url_for(page.path)}#more`}>{__('article.more')}</a> 
                    </div>
                    </div>
                     {/* Begin -- CUSTOM LastEdited*/}
                    { page.updated && page.updated > page.date ?
                                <div class="level-start">
                                    <div class="level-item has-text-grey is-size-7">
                                        <time datetime={date_xml(page.updated)}><i
                                            class="far fa-calendar-check">&nbsp;{lastModified}&nbsp;</i>{date(page.updated)}
                                        </time>
                                    </div>
                                </div> : null}
                    </div> : null}
                    {/* End -- CUSTOM LastEdited*/}
                    {/* Begin -- CUSTOM copyright*/}
                        {use_copyright && !index && page.layout == 'post' ?
                        <ul class="post-copyright">
                            <li><strong>{copyrightTitle}</strong><a href={copyrightPermalink}>{page.title}</a></li>
                            <li><strong>{copyrightAuthor}</strong><a href={url_for(config.url)}>{config.author}</a></li>
                            <li><strong>{copyrightLink}</strong><a href={copyrightPermalink}>{copyrightPermalink}</a></li>
                            <li><strong>{copyrightCopyrightTitle}</strong><span dangerouslySetInnerHTML={{ __html: copyrightCopyrightContent }}></span>
                            </li>
                        </ul> : null}
                    {/* {!index && page.layout == 'post' ? <RecommendPosts config={config} curPost={page} helper={helper} site={site} /> : null} */}
                    {/*End -- CUSTOM copyright*/}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile">
                {page.prev ? <div class="level-start">
                    <a class={`article-nav-prev level level-item${!page.prev ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class={`article-nav-next level level-item${!page.next ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
