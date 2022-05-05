import { PatternPasteEvent } from '@editorjs/editorjs/types/tools/paste-events';
import { API } from '@editorjs/editorjs/types/index';
import { ToolConfig } from '@editorjs/editorjs/types/tools/tool-config';
import '@rmwc/circular-progress/circular-progress.css';
export declare type TweetData = {
    username: string;
    id: string;
    url: string;
};
interface Constructor {
    data?: TweetData;
    api: API;
    config?: ToolConfig;
}
declare global {
    interface Window {
        twttr: any;
    }
}
export default class Twitter {
    private tweetData;
    private wrapper;
    private loader;
    private tweetContainer;
    constructor(params: Constructor);
    onPaste(event: PatternPasteEvent): void;
    private handlePastedUrl;
    private createTweet;
    static get pasteConfig(): {
        patterns: {
            twitter: RegExp;
        };
    };
    private createCircularProgress;
    save(): TweetData;
    render(): HTMLElement;
}
export {};
