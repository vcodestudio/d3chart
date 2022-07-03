module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'd3',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  plugins:[
    // { src: '~node_modules/d3/dist/d3.min.js', ssr: false}
  ],
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */

  //commonJS use
  build: {
    standalone:true,
    babel: {
      plugins: [['@babel/plugin-proposal-private-property-in-object', { loose: true }]],
    },
  },
}

