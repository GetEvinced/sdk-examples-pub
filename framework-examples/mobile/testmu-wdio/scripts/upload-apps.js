#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { LT_USERNAME, LT_ACCESS_KEY } = process.env;

if (!LT_USERNAME || !LT_ACCESS_KEY) {
  console.error('Missing LT_USERNAME or LT_ACCESS_KEY in .env.local');
  process.exit(1);
}

function upload(filePath, name) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(1);
  }

  process.stdout.write(`Uploading ${name}... `);
  const raw = execSync(
    `curl -s -u "${LT_USERNAME}:${LT_ACCESS_KEY}" -X POST` +
    ` "https://manual-api.lambdatest.com/app/upload/realDevice"` +
    ` -F "appFile=@${abs}" -F "name=${name}"`
  ).toString();

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    console.error(`\nUnexpected response: ${raw}`);
    process.exit(1);
  }

  if (!json.app_url) {
    console.error(`\nUpload failed: ${JSON.stringify(json)}`);
    process.exit(1);
  }

  console.log(json.app_url);
  return json.app_url;
}

const androidUrl = upload('./proverbial_android.apk', 'ProverbialAndroid');
const iosUrl     = upload('./proverbial_ios.ipa',     'ProverbialIOS');

let env = fs.readFileSync('.env.local', 'utf8');
env = env.replace(/^LT_ANDROID_APP_URL=.*$/m, `LT_ANDROID_APP_URL=${androidUrl}`);
env = env.replace(/^LT_IOS_APP_URL=.*$/m,     `LT_IOS_APP_URL=${iosUrl}`);
fs.writeFileSync('.env.local', env);

console.log('\n.env.local updated — ready to run tests.');
