export const baseURL = 'https://staging.farmbook.carbonmint.com/api'
// export const baseURL = 'http://192.168.1.12:3000/api'

export const urls = {
    auth: '/auth?from=mobile',
    createEvent: '/fb-mobile/event/create',
    echo: '/echo',
    deviceToken: '/fb-mobile/user/update',
    fetchNotification: '/fb-mobile/notification',
    updateNotification: '/fb-mobile/notification/update',
    csrf: `/auth/csrf`,
    callback: `/auth/callback/credentials`,
    session: `/auth/session`,
    externalImages: (name) => `https://carbon-mint.github.io/qr-assets.github.io/assets/images/MobileIcons/${name}`,
}