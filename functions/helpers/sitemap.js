const moment = require("moment-timezone");
const s3Proxy = require("s3-proxy");
const AWS = require("aws-sdk");

const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket,
} = require("../config/keys");

const s3 = new AWS.S3({
  accessKeyId: amazonAccessKeyID,
  secretAccessKey: amazonSecretAccessKey,
});

const createProxy = (req, res, next) => {
  s3Proxy({
    bucket: amazonBucket,
    accessKeyId: amazonAccessKeyID,
    secretAccessKey: amazonSecretAccessKey,
    overrideCacheControl: "max-age=100000",
  })(req, res, next);
};

const createSitemap = async () => {
  if (process.env.FUNCTIONS_EMULATOR === "true") return;
  console.log("Starting sitemap construction");

  let siteMapString =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>monthly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/chat-with-strangers</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>monthly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/make-friends</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/people-online</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.9</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/rules</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>monthly</changefreq>\n<priority>0.2</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/site-info</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>monthly</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/vent-to-strangers</loc>\n<lastmod>2022-02-02</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/feel-good-quotes-month</loc>\n<lastmod>2022-02-04</lastmod>\n<changefreq>weekly</changefreq>\n<priority>1</priority>\n</url>\n\n";

  siteMapString += "</urlset>";

  const params = {
    Bucket: amazonBucket,
    Key: "sitemapurls.xml",
    Body: siteMapString,
  };

  s3.putObject(params, (err) => {
    if (err) console.log(err);
  });

  const siteMapIndexString =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap>\n<loc>https://blog.ventwithstrangers.com/sitemap.xml</loc>\n<lastmod>' +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n\n</sitemap>\n<sitemap>\n<loc>https://www.ventwithstrangers.com/sitemapurls.xml</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n</sitemap>\n\n</sitemapindex>";

  const params2 = {
    Bucket: amazonBucket,
    Key: "sitemap.xml",
    Body: siteMapIndexString,
  };

  s3.putObject(params2, (err, data) => {
    console.log(data);
    if (err) console.log(err);
  });
  console.log("finished");
};

module.exports = {
  createProxy,
  createSitemap,
};
