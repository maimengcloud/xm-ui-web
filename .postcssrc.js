// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "autoprefixer": {
    "grid": true
  },
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "cssnano":{
      autoprefixer:false,
      "postcss-zindex":false,
    }
  }
}
