module.exports = {
  apps: [
    {
      name: 'bibliokit-dev',
      script: 'npx',
      args: 'netlify dev',
      cwd: '/Users/emily/Products/BiblioKit Launch ',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'development'
      },
      log_file: './logs/bibliokit-combined.log',
      out_file: './logs/bibliokit-out.log',
      error_file: './logs/bibliokit-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};