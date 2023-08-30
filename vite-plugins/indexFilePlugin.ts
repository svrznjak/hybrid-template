import appConfig from '../src/app/config.json'

export default function indexFilePlugin() {
  return {
    name: 'index-file-plugin',
    transformIndexHtml(html: string) {
      // Get the environment variable values for meta tags
      const title = appConfig.APP_TITLE || 'Title'
      const metaDescription = appConfig.META_DESCRIPTION || 'Description'
      const safariPinnedTabColor = appConfig.SAFARI_PINNED_TAB_COLOR || '#2196f3'
      const themeColor = appConfig.THEME_COLOR || '#2196f3'

      // Generate the meta tags and add them to the HTML
      const tags = `
      <!-- Start Vite generated Tags -->
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="${safariPinnedTabColor}">
        <meta name="theme-color" content="${themeColor}"> 
        <meta name="description" content="${metaDescription}">
        <title>${title}</title> 
      <!-- End Vite generated Tags -->
      `

      return html.replace('</head>', `${tags}</head>`)
    }
  }
}
