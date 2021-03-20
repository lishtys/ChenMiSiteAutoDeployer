const moment = require('moment');
const { Component, Fragment, render } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const ArticleLicensing = require('hexo-component-inferno/lib/view/misc/article_licensing');

function ComponentWithTransition(title1, content1, cover1, link1) {
   
   return  <div class="columns " >
   <div class="column"><div class="card">
   <div class="card-image"><a class="image is-3by1" href={link1}>
       <img class="fill" src= {cover1} alt={title1}/></a></div>
       <article class="card-content article" role="article">
       <h1 class="title is-3 is-size-4-mobile"><a class="link-muted" href={link1}>{title1}</a></h1>
           {/* <div class="article-meta is-size-7 is-uppercase level is-mobile">
               <div class="level-left"><span class="level-item">Posted&nbsp;<time datetime="2020-04-01T00:00:00.000Z" 
               title="2020-04-01T00:00:00.000Z">a year ago</time></span><span class="level-item">3 minutes read (About 461 words)
               </span></div>
               </div> */}
                   <div class="content"> <p> {content1} </p></div><a class="article-more button is-small; is-size-7" 
                   href={link1}>Read more</a></article></div></div>
                <div class="column"></div>
                   </div>               
}

function PairComponenet(title1, content1, cover1, link1, title2, content2, cover2, link2){
    return  <div class="columns">
    
    <div class="column"><div class="card">
    <div class="card-image"><a class="image is-7by3" href={link1}>
        <img class="fill" src= {cover1} alt={title1}/></a></div>
        <article class="card-content article" role="article">
        <h1 class="title is-3 is-size-4-mobile"><a class="link-muted" href={link1}>{title1}</a></h1>
            {/* <div class="article-meta is-size-7 is-uppercase level is-mobile">
                <div class="level-left"><span class="level-item">Posted&nbsp;<time datetime="2020-04-01T00:00:00.000Z" 
                title="2020-04-01T00:00:00.000Z">a year ago</time></span><span class="level-item">3 minutes read (About 461 words)
                </span></div>
                </div> */}
                    <div class="content"> <p> {content1} </p></div><a class="article-more button is-small; is-size-7" 
                    href={link1}>Read more</a></article></div></div>

  <div class="column"><div class="card">
    <div class="card-image"><a class="image is-7by3" href={link2}>
        <img class="fill" src= {cover2} alt={title2}/></a></div>
        <article class="card-content article" role="article">
        <h1 class="title is-3 is-size-4-mobile"><a class="link-muted" href={link2}>{title2}</a></h1>
            {/* <div class="article-meta is-size-7 is-uppercase level is-mobile">
                <div class="level-left"><span class="level-item">Posted&nbsp;<time datetime="2020-04-01T00:00:00.000Z" 
                title="2020-04-01T00:00:00.000Z">a year ago</time></span><span class="level-item">3 minutes read (About 461 words)
                </span></div>
                </div> */}
                    <div class="content"> <p> {content2} </p></div><a class="article-more button is-small; is-size-7" 
                    href={link2}>Read more</a></article></div></div>                      
        </div>
}


function formatWidgets(works, type) {
    const result = {};
    if (Array.isArray(works)) {
        works.filter(work => typeof work === 'object').forEach(work => {
            if ('tag' in work && (work.tag === type)) {
                if (!(work.tag in result)) {
                    result[work.tag] = [work];
                } else {
                    result[work.tag].push(work);
                }
            }
        });
    }
    return result;
}

function buildList(worklist){
    let workItem =worklist[0];
    var result = [];
    if (Array.isArray(worklist)) {
        worklist.forEach((work, name) => {
            let item = work;
            if(name % 2 == 1 || name === worklist.length - 1){
                if(name % 2 == 1){
                    result.push(PairComponenet(workItem.title, workItem.description, workItem.thumb, workItem.detail, item.title, item.description, item.thumb, item.detail));
                }else{
                    result.push(ComponentWithTransition(item.title, item.description, item.thumb, item.detail));  
                }
            }else  {
              workItem = work;
            }
        });
    }

 
    return result;
   

}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { url_for, date, date_xml, __, _p } = helper;
        const indexLaunguage = config.language || 'en';
        const language = page.lang || page.language || config.language || 'en';
        const cover = page.cover ? url_for(page.cover) : null;
        const {works = []} = config;
        const productWorks = formatWidgets(works,'product')['product'];
        const projectWorks = formatWidgets(works,'project')['project'];

        const embeddedConfig = `(() => {
            function switchTab() {
                if (!location.hash) {
                  return;
                }
                Array
                    .from(document.querySelectorAll('.tab-content'))
                    .forEach($tab => {
                        $tab.classList.add('is-hidden');
                    });
                Array
                    .from(document.querySelectorAll('.tabs li'))
                    .forEach($tab => {
                        $tab.classList.remove('is-active');
                    });
                const $activeTab = document.querySelector(location.hash);
                if ($activeTab) {
                    $activeTab.classList.remove('is-hidden');
                }
                const $tabMenu = document.querySelector(\`a[href="\${location.hash}"]\`);
                if ($tabMenu) {
                    $tabMenu.parentElement.classList.add('is-active');
                }
            }
            switchTab();
            window.addEventListener('hashchange', switchTab, false);
        })();`;

        return <Fragment>
            {/* Main content */}
            
                {/* Thumbnail */}
                {cover ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </a> : <span class="image is-3by1">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </span>}
                </div> : null}
                {/* Metadata */}
                <article class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                   
                <button class="button is-large is-black">
                    <span class="icon is-medium">
                        <i class="fas fa-cubes"></i>
                        </span><span>Portfolio</span></button>
                    {/* Title */}
                    {/* <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" 
                    href={url_for(page.link || page.path)} ><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span>
                    <span style="display:inline-block;padding:2px 3px">Portfolio</span></a> */}
                    
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                   
                    {/* Product Tab */}
                    <div id="products" class="tab-content  is-hidden">{buildList(productWorks)}</div>

                    {/* All Tab */}
                    <div id="all" class="tab-content">{buildList(works)}</div>

                   {/* Projects Tab */}
                    <div id="projects" class="tab-content is-hidden">{buildList(projectWorks)}</div>

                  
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            
            <span></span>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}

            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
        </Fragment>
    }
};
