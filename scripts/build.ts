import webpack from 'webpack'
import webpackCig from './config/webpack.main'

function build() {
  return new Promise((resolve, reject) => {
    webpack(webpackCig, (err, stats) => {
      if (err) throw err
      if (!stats) throw 'Webpack states error!'

      process.stdout.write(
        stats.toString({
          colors: true,
          hash: true,
          version: true,
          timings: true,
          assets: true,
          chunks: false,
          children: false,
          modules: false
        }) + '\n\n'
      )

      if (stats.hasErrors()) {
        reject(stats)
      } else {
        resolve(undefined)
      }
    })
  })
}

build()
