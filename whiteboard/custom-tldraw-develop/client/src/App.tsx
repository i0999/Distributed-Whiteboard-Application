import { useSync } from '@tldraw/sync';
import {
    AssetRecordType,
    DefaultQuickActions,
    DefaultQuickActionsContent,
    getHashForString,
    TLAssetStore,
    TLBookmarkAsset,
    Tldraw,
    TldrawUiMenuItem,
    uniqueId,
} from 'tldraw';

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost/api';

function CustomQuickActions() {
    return (
        <DefaultQuickActions>
            <DefaultQuickActionsContent />
            <div style={{ backgroundColor: 'thistle' }}>
                <TldrawUiMenuItem
                    id="share"
                    icon="link"
                    onSelect={() => {
                        // Create a sharable link
                    }}
                />
            </div>
        </DefaultQuickActions>
    );
}

function getRoomConfig() {
    let roomId = window.localStorage.getItem('roomId');
    if (!roomId) {
        roomId = window.crypto.randomUUID();
        window.localStorage.setItem('roomId', roomId);
    }

    return {
        // We need to know the websocket's URI...
        uri: `${WORKER_URL}/connect/${roomId}`,
        // ...and how to handle static assets like images & videos
        assets: multiplayerAssets,
    };
}

function App() {
    // Create a store connected to multiplayer.
    const store = useSync(getRoomConfig());

    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Tldraw
                // we can pass the connected store into the Tldraw component which will handle
                // loading states & enable multiplayer UX like cursors & a presence menu
                store={store}
                onMount={(editor) => {
                    // @ts-expect-error
                    window.editor = editor;
                    // when the editor is ready, we need to register out bookmark unfurling service
                    editor.registerExternalAssetHandler(
                        'url',
                        unfurlBookmarkUrl
                    );
                }}
                components={{ QuickActions: CustomQuickActions }}
            />
        </div>
    );
}

// How does our server handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
    // to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
    async upload(_asset, file) {
        const id = uniqueId();

        const objectName = `${id}-${file.name}`;
        const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`;

        const response = await fetch(url, {
            method: 'PUT',
            body: file,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload asset: ${response.statusText}`);
        }

        return { src: url };
    },
    // to retrieve an asset, we can just use the same URL. you could customize this to add extra
    // auth, or to serve optimized versions / sizes of the asset.
    resolve(asset) {
        return asset.props.src;
    },
};

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({
    url,
}: {
    url: string;
}): Promise<TLBookmarkAsset> {
    const asset: TLBookmarkAsset = {
        id: AssetRecordType.createId(getHashForString(url)),
        typeName: 'asset',
        type: 'bookmark',
        meta: {},
        props: {
            src: url,
            description: '',
            image: '',
            favicon: '',
            title: '',
        },
    };

    try {
        const response = await fetch(
            `${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();

        asset.props.description = data?.description ?? '';
        asset.props.image = data?.image ?? '';
        asset.props.favicon = data?.favicon ?? '';
        asset.props.title = data?.title ?? '';
    } catch (e) {
        console.error(e);
    }

    return asset;
}

export default App;
