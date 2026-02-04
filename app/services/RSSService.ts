import { XMLParser } from 'fast-xml-parser';

export interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
});

const FEED_URL = 'https://hnrss.org/frontpage';

export const RSSService = {
    fetchFeed: async (): Promise<FeedItem[]> => {
        try {
            const response = await fetch(FEED_URL);
            const text = await response.text();
            const xml = parser.parse(text);

            // Handle standard RSS 2.0 structure
            const items = xml?.rss?.channel?.item || [];

            // Ensure items is an array (single item might be an object)
            const feedItems = Array.isArray(items) ? items : [items];

            return feedItems.map((item: any) => ({
                title: item.title || 'Untitled',
                link: item.link || '#',
                pubDate: item.pubDate || '',
                contentSnippet: item.description || '', // RSS typically uses 'description'
            })).slice(0, 20); // Limit to top 20

        } catch (error) {
            console.warn('RSS Fetch Error:', error);
            return [
                { title: 'Welcome to Moonshine', link: '#', pubDate: new Date().toString(), contentSnippet: 'The night is young.' },
                { title: 'Feed Error - Could not load.', link: '#', pubDate: new Date().toString(), contentSnippet: 'Please check your connection.' },
            ];
        }
    }
};
