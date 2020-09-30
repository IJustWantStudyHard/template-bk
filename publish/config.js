module.exports = {
  title: 'dist',
  host: '123.56.68.226',
  port: 22,
  username: 'root',
  privateKey: require('fs').readFileSync('c:/Users/zmx/.ssh/id_rsa'),
  path: '/www/wwwroot/qrdevelop/public'
}

