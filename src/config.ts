import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig,
} from "./types/config"
import type { FriendLink } from "./types/friend"
import type { I18nConfig } from "./types/i18n"

export const siteConfig: SiteConfig = {
    title: "Glacier's blog",
    headerTitle: "GLACIER",
    subTitle: "",
    rootSiteUrl: "https://www.glac1er.top",

    favicon: "/favicon/icon.png",

    pageSize: 6,
    toc: {
        enable: true,
        depth: 3
    },
    blogNavi: {
        enable: true
    },
    comments: {
        enable: true,
        platform: "default",
        backendUrl: "https://api-momo.motues.top"
    },
    theme: {
        AOS: false,
        LQIP: true,
        PhotoSwipe: true,
        header: {
            mobileNavFontSize: "1.08rem"
        },
        postCard: {
            imageMode: "top"
        }
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "/favicon/icon.png",
    name: "Glacier",
    description: "glacier's blog",
    indexPage: "https://www.glac1er.top",
    startYear: 2024,
}

export const licenseConfig: LicenseConfig = {
    enable: true,
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const i18nConfig: I18nConfig = {
    defaultLanguage: "zh-cn",
    supportedLanguages: ["zh-cn", "en"],
    translations: {
        "zh-cn": {
            Cover: {
                title: {
                    home: "欢迎来到我的博客",
                    archive: "文章归档",
                    about: "关于",
                    friends: "友链",
                },
                subTitle: {
                    home: "",
                    archive: "共 {count} 篇文章",
                    about: "",
                    friends: "",
                }
            }
        },
        "en": {
            Cover: {
                title: {
                    home: "Welcome",
                    archive: "Archive",
                    about: "About",
                    friends: "Friends",
                },
                subTitle: {
                    home: "",
                    archive: "Total of {count} articles",
                    about: "A minimalist blog template",
                    friends: "Interesting Souls",
                }
            }
        }
    }
};

export const friendLinkConfig: FriendLink[] = [
    {
        name: 'zizimiku',
        avatar: '',
        url: 'https://userzbb.github.io',
        description: '可爱泉此方'
    },
]
