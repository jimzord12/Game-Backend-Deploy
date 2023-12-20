function parseMysqlUrl(url) {
  const regex =
    /^mysql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(\?ssl=\{([^}]+)\})?/;
  const match = url.match(regex);

  if (match) {
    const sslOptions = match[6] ? JSON.parse(`{${match[6]}}`) : null;
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      databaseName: match[4],
      ssl: sslOptions,
    };
  } else {
    throw new Error("Invalid URL format");
  }
}

// // Example usage
// const url =
//   'mysql://username:password@hostName/databaseName?ssl={"rejectUnauthorized":true}';
// const dbConfig = parseMysqlUrl(url);

// console.log(dbConfig);

module.exports = parseMysqlUrl;
