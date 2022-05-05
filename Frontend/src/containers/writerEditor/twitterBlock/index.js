
class Twitter {
    constructor(params) {
        this.tweetData = params.data;
        this.wrapper = document.createElement('div');
        this.tweetContainer = document.createElement('div');
        this.loader = this.createCircularProgress();
        this.wrapper.appendChild(this.loader);
        this.wrapper.appendChild(this.tweetContainer);
        this.tweetContainer.style.height = '0px';
        if (this.tweetData && this.tweetData.url) {
            this.tweetData.url = this.tweetData.url.trim();
        }
    }
    onPaste(event) {
        this.handlePastedUrl(event.detail.data);
    }
    handlePastedUrl(url) {
        url = url.trim();
        const tweetID = url.match(/twitter\.com\/.*\/status(?:es)?\/([^/?]+)/);
        const tweetUsername = url.match(/((https?:\/\/)?(www\.)?twitter\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})/);
        if (tweetID && tweetID[1] && tweetUsername && tweetUsername[5]) {
            this.tweetData = {
                username: tweetUsername[5],
                id: tweetID[1].toString(),
                url
            };
            this.createTweet();
        }
    }
    createTweet() {
        window.twttr.widgets.createTweet(this.tweetData.id, this.tweetContainer).then((el) => {
            if (el) {
                el.parentNode.style.height = 'auto';
                el.parentNode.style.display = 'flex';
                el.parentNode.style.width = 'auto';
                el.parentNode.style.justifyContent = 'center';
                el.parentNode.previousElementSibling.remove();
            }
        });
    }
    static get pasteConfig() {
        return {
            patterns: {
                twitter: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?([^?]+)(\?.*)?$/
            }
        };
    }
    createCircularProgress() {
        const container = document.createElement('div');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svg.setAttribute('viewBox', '0 0 72 72');
        circle.setAttribute('cx', '36');
        circle.setAttribute('cy', '36');
        circle.setAttribute('r', '30');
        svg.appendChild(circle);
        container.appendChild(svg);
        container.style.display = 'none';
 
        return container;
    }
    save() {
        return this.tweetData;
    }
    render() {
        if (this.tweetData.id) {
            this.createTweet();
        }
        return this.wrapper;
    }
}

export default Twitter
//# sourceMappingURL=index.js.map