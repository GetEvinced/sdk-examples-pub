# Evinced Selenium Java SDK — LambdaTest Example

A working example of the [Evinced Selenium Java SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk) running on [LambdaTest](https://www.lambdatest.com/)'s cloud grid.

Two JUnit 5 tests scan `https://demo.evinced.com/` for accessibility issues and generate HTML reports.

| Test | Mode | Report |
|---|---|---|
| `StaticAnalysisTest` | Single snapshot (`evAnalyze`) | `reports/static-analysis.html` |
| `ContinuousModeTest` | Continuous monitoring (`evStart`/`evStop`) | `reports/continuous-mode.html` |

## Prerequisites

- Java 11+
- Maven 3.8+
- LambdaTest account — [sign up](https://accounts.lambdatest.com/register)
- Evinced account — credentials from [Evinced Product Hub](https://hub.evinced.com/) (Automation for Web → Get SDK)

## Setup

### 1. Configure runtime credentials

```bash
cp .env.example .env
```

Edit `.env` and fill in all five values:

```
LT_USERNAME=your-lambdatest-username
LT_ACCESS_KEY=your-lambdatest-access-key
EVINCED_SERVICE_ID=your-evinced-service-id
EVINCED_API_KEY=your-evinced-api-key
TEST_URL=https://demo.evinced.com/
```

**Where to find them:**
- `LT_USERNAME` / `LT_ACCESS_KEY` — [LambdaTest Profile](https://accounts.lambdatest.com/security)
- `EVINCED_SERVICE_ID` / `EVINCED_API_KEY` — [Evinced Product Hub](https://hub.evinced.com/) → Automation for Web → Get SDK

### 2. Make the Evinced SDK available to Maven

Choose **one** of the two options below.

#### Option A — JFrog Artifactory (recommended for teams)

Copy `settings.xml.template` to your local Maven settings and fill in your JFrog credentials:

```bash
cp settings.xml.template ~/.m2/settings.xml
```

Edit `~/.m2/settings.xml` and replace `YOUR_JFROG_USERNAME` and `YOUR_JFROG_TOKEN` with your Evinced JFrog credentials (available from the [Evinced Product Hub](https://hub.evinced.com/) → Automation for Web → Get SDK).

> If you already have a `~/.m2/settings.xml`, merge the `<server>` block from `settings.xml.template` into your existing file rather than replacing it.

#### Option B — Local JAR install (no JFrog account required)

If you have the SDK JAR file (e.g. `selenium-sdk-4.28.1.jar`, downloadable from the Evinced Product Hub), install it directly into your local Maven cache:

```bash
mvn install:install-file \
  -Dfile=selenium-sdk-4.28.1.jar \
  -DgroupId=com.evinced \
  -DartifactId=selenium-sdk \
  -Dversion=4.28.1 \
  -Dpackaging=jar
```

Then update the `<evinced.version>` property in `pom.xml` to match your JAR version:

```xml
<evinced.version>4.28.1</evinced.version>
```

No `settings.xml` changes needed — Maven resolves the dependency from your local `~/.m2` cache. You can remove or ignore the `settings.xml.template` file entirely.

## Run

```bash
mvn test
```

## Reports

After the tests run, open the HTML reports:

```bash
open reports/static-analysis.html
open reports/continuous-mode.html
```
