module.exports = {
  mysql: {
    host: '127.0.0.1',
    user: 'netai',
    password: '',
    database: 'feedcourt_dev',
    charset: 'utf8'
  },
  mail: {
    smtp: {
      host : "smtp.webfaction.com",
      secureConnection : true,
      port: 465,
      auth : {
          user : "feedcourt",
          pass : "feedcourt123"
      }
    },
    from_email: 'info@feedcourt.com'
  },
  server: 'localhost',
  port: 8081,
  sessionSecret: 'netainayek',
  secretKey: 'helloworld'
};
