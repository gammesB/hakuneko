import SpeedBinb from './templates/SpeedBinb.mjs';
import Manga from '../engine/Manga.mjs';

export default class Ynjn extends SpeedBinb {

    constructor() {
        super();
        super.id = 'ynjn';
        super.label = 'ヤンジャン！ (ynjn)';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://ynjn.jp';
    }

    async _getMangaFromURI(uri) {
		if(uri.href.includes("/viewer/")){//as there is no way for users to get the chapter list without manualy changing the url
			uri.href = uri.href.split("/viewer")[0];
		}
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, '.comic_title');
        let id = uri.pathname;
        let title = data[0].innerText.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let msg = "This website doesn't provides a manga list, please copy and paste the URL containing the images directly from your browser into HakuNeko.";
        throw new Error(msg);
    }
    async _getChapters(manga) {
        const uri = new URL(manga.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '.episodes_area .episode:not(.disabled) a');
        return data.reverse()
            .filter(e => e.querySelector(".button .button-box").getAttribute("class").includes("btn_free"))
            .map(element => {
                return {
                    id:  this.getRootRelativeOrAbsoluteLink(element, this.url),
                    title: element.querySelector('.num').textContent.trim() + " " + element.querySelector('.title').textContent.trim()
                };
            });
    }
}