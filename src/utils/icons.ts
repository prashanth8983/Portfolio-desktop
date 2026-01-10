// Base path for assets (matches vite.config.ts base)
const BASE_PATH = import.meta.env.BASE_URL;

// Local icons in public/icons folder (converted from icns)
const localIcons: Record<string, string> = {
    numbers: 'icons/numbers.png',
    folder: 'icons/folder.png',
    projects: 'icons/folder.png',
    documents: 'icons/folder.png',
    vscode: 'icons/vscode.png',
    mail: 'icons/mail.png',
    trash: 'icons/trash.png',
    'trash-empty': 'icons/trash-empty.png',
    finder: 'icons/finder.png',
    photos: 'icons/photos.png',
    safari: 'icons/safari.png',
    calculator: 'icons/calculator.png',
    terminal: 'icons/terminal.png',
};

// Icons8 CDN mapping
const icons8Map: Record<string, string> = {
    // App IDs
    finder: 'finder',
    safari: 'safari',
    terminal: 'console',
    mail: 'mac-os-mail',
    music: 'apple-music',
    photos: 'apple-photos',
    preferences: 'settings',
    'system-prefs': 'settings',
    trash: 'full-trash',
    'trash-empty': 'empty-trash',
    calculator: 'calculator',
    textedit: 'edit',
    'activity-monitor': 'performance-macbook',
    calendar: 'calendar',
    preview: 'pdf-2',

    // File Types
    folder: 'mac-folder',
    projects: 'opened-folder',
    documents: 'documents-folder',
    pdf: 'pdf',
    // Education
    education: 'graduation-cap',
    // Fallback
    app: 'mac-os',
    contact: 'address-book',
};

export const getIconUrl = (id: string): string => {
    const lowerId = id.toLowerCase();

    // Check local icons first
    if (localIcons[lowerId]) {
        return `${BASE_PATH}${localIcons[lowerId]}`;
    }

    // Fall back to icons8 CDN
    const iconName = icons8Map[lowerId] || 'mac-os';
    return `https://img.icons8.com/fluency/96/${iconName}.png`;
};
