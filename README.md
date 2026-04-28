
# Evinced Support SDK Examples

Welcome to the **Evinced Support SDK Examples** repository! This repository provides working examples of the latest code snippets and dependencies, ensuring customers can copy and use reliable, up-to-date examples for their projects.

## Overview

This repository is designed to:
- Provide **reliable and functional examples** for customers to integrate Evinced SDKs with ease.
- Ensure all examples are **validated and maintained** using automated smoke tests.
- Enable seamless integration of the latest SDK features with minimal effort.

---

## Features

### 🔧 Latest Code Snippets
- Each example is written with the latest versions of the SDKs and dependencies.
- Easy-to-follow examples for quick integration into your project.

### ✅ Reliable Examples
- All examples are validated using **smoke tests**, ensuring they work as expected out of the box.
- Examples are updated regularly to reflect the latest SDK improvements and bug fixes.

### 🚀 Quick Start
- Copy and paste examples directly into your project.
- Documentation and comments are included for every example.

---

## To note:
- In each folder, the commands to use the repository are present in the `README.md` file and they vary slightly project by project, please take a moment to review
- In order for this to work properly, you must add a `.npmrc` file or provide the necessary authentication credentials related to your SDK. The keys can be obtained by logging into your Evinced account
- Please ensure you run `npm install` to set the project up
- You will see that in the tests we do use environment variables which are stored on our machines, you will need to either set the named variables on your machine or change accordingly to ensure you get up and running!

An example set of environment variables might look like this:
```javascript
configure({
  serviceAccountId: process.env.EVINCED_SERVICE_ID,
  serviceAccountSecret: process.env.EVINCED_API_KEY,
});
```
---
### Got Questions? 
Do not hesitate to reach out to the Support team (support@evinced.com)