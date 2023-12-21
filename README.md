# Dart Coverage Assistant 🎯🧪

A no-brainer tool to generate coverage reports for your Dart projects. Plug and
play, both for your existing CI, or in a new project.

[![Empowered by whynotmake.it][wnmi_badge]](whynotmake.it)
[![License: MIT][mit_badge]](./LICENSE) ![Test coverage](./badges/coverage.svg)

## Features

### 🔌 Plug and Play

- No configuration needed, just add the action to your workflow
- Automatically finds all projects in your repository
- Doesn't run any tests by default, so it works with your existing CI
- Can run tests for you (good if you have no CI yet)

### 💬 Keep an eye on your coverage

- Post a sticky comment on every PR
- Updates automatically if you make changes
- Shows coverage for every project in your repository
- Can show differences between the current and the base branch

### 👮‍♂️ Enforce rules

- Choose between multiple rules:
  - Fail the action if total repo coverage drops below threshold
  - Fail the action if any single project coverage drops below threshold
  - Fail the action if total repo coverage decreases in PR
  - Fail the action if any single project coverage decreases in PR

### 🔰 Generate Badges

- Show off your coverage in your README or on your website, without signing up
  to a third party service
- Generate badges on `push` events

## Get Started

Getting started with `dart-coverage-assistant` is easy. It works out of the box
with your existing CI pipeline to give you the power of coverage reporting. If
you don't have a CI yet, it can also run your tests for you.

### For CI Aficionados

```yaml
jobs:
  flutter-check:
    name: Build Check
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      # ---
      # Your existing steps...
      # ---
      - name: 📊 Generate Coverage
        id: coverage-report
        uses: whynotmake-it/dart-coverage-assistant@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          lower_threshold: 50
          upper_threshold: 90
```

> [!IMPORTANT] 
> With this setup, this action will assume, that your projects have
> up-to-date coverage. This can be achieved by either running the tests like
> `flutter test --coverage` in the steps before this action, or always running
> them locally. Check the section below for more information about configuration
> options.

### For CI Newbies

If you just want a drop-in CI pipeline, just copy the following into your
`.github/workflows/main.yml` file. This will run your tests and generate a
coverage report for you.

```yaml
name: Continuous Integration

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  flutter-check:
    name: Build Check
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: 📚 Checkout
        uses: actions/checkout@v4

      - name: 🐦 Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          sdk: 'stable'

      - name: 📊 Generate Coverage
        id: coverage-report
        uses: whynotmake-it/dart-coverage-assistant@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          testing_command: flutter test --coverage
          lower_threshold: 50
          upper_threshold: 90
```

## Configuration

Below you will find a short list of all available configuration options, and
what they do.

- `lower_threshold` (optional, default: `100`): The lower threshold for code
  coverage, anything below this is considered a failure.
- `upper_threshold` (optional, default: `100`): The threshold for the coverage
  to be considered 'good', anything below this is considered critical.
- `compare_against_base` (optional, default: `true`): Whether to compare against
  the base when running in a PR.
- `enforce_threshold` (optional, default: `'total'`): Whether the action should
  fail if the coverage is below the lower threshold. Can be set to "none",
  "single", or "total".
- `enforce_forbidden_decrease` (optional, default: `'total'`): Whether the
  action should fail if the coverage decreases. Can be set to "none", "single",
  or "total".
- `generate_badges` (optional, default: `true`): Whether to generate badges for
  the coverage on 'push' workflow triggers.

## Honorable mentions

- Big thanks to @JohannSchramm for his help and being an inspiration for this
  project.

[mit_badge]:
  https://img.shields.io/github/license/artiomtr/jest-coverage-report-action
[wnmi_badge]:
  https://img.shields.io/badge/empowered_by-whynotmake.it-black?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAe2SURBVHgB7Z2BlaM2EIbHqWBLoITtIE4HlwpMKthNBSYV5DpYXwWXVOB0cNcB6WC3g4l44Lw5kECCEUjwf%2B%2Fx%2FNaGGYG%2BNQLGQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAgTpQgzHw2L0X35%2FfT6fSdVsDkfTIvL2Y6m%2BnZTM3fH00bzPTFtONGID9Mx76Y6Z2H1GYqKCIm%2FidH7lXbAZQxHXblaS4UAc%2FcDxr5ngmkT2DHqsoVmBty5YKjY5uOezPTV44oF7ulqrgdbzXzPJvpBrkyYkSqZzFPyRHkGpGqdMxfTbUVJICPVGJeVblCpRLLQa6UCZFKLKMi11ypxPKQK0XmSCWWXSTXUqlEHMiVEkukEjFmyaUllYgHuVJAQyoRK0gubalEXJdcTwTioymViOklVyypRHybXBWBuMSQSsR2yfWp%2B%2FwlplSiHZ978b8RiEdMqUSO0pVjDam6NhSW%2FG8xch2esQ4nZUZyRZdqJP%2BDmjGg16PboNGlEvkqHueVIsDtt1U9kRtHixqYjXi2bNyoG9aRU1KQMp5SHVKunygORe%2Fvv1co1vt54vOSFOlEvdNwXW9m%2BtVMX3rvN6cg7keSSx0ejjnuFBH2L33RqopwfVNVvflwElUTth%2BRrV2kd%2BcIcvlKJeaHXJo4OnatIr2y%2BzzoDL1HviCpxHKQSwt2D6ZjF%2BmVvfm0qiJmSSWWh1xaMCdTpLe0KmKRVCIO5NKC0ynSm1sVoSKViAe5tOB0ivRCqyJUpRJxXXIVBMLgdIr0fKsiokgl4tvk%2BkwgHOZkivRc7XjtPj%2FHlEq0oy%2FXO4F5MCdTpOdqh4uKImDLw%2B0tBkAozMkU6fnKVVEEeFhuI6kZA%2FpwRjr1yu2u6E%2BOKJVHOx68UQRM3CczfZvIjaPFOXD47qikCEy040zKeEoFuZbA%2FnKVFJGRdlSkyIhUzXvN%2BOrGkEsHbm8hVPNGUol2qJxvG4k%2FJtWTmA8nUbXglcZUHu2IdRnKSyoxP%2BRaCkc%2B%2BpvRHu3LUEFSieUg11xSk0q0S%2Bsy1CypxPKQK5RUpXqwVK6lUok4kMuX1KV6MFcuLalEPMg1RS5SPeDwy1CqUom4qIpwkZtUD9j%2FMlQUqUR8m1xRf6ySPOy%2BNlZSBvB0VURUqUQ7BlURmvGzw7HRS8qIEblc94hXlUq0o%2B7lufARx1ts%2F0lYSRnC0z%2FnjypV14YxkQs6CmZlX3sb4C%2FKFG53eVNPsYgp1XUi93GOFnl4D6koN%2BlYCx6vTthSqiTkinXvBhv9Df1BK8BtbVdzkbugdWjuUfHL6XRSX79GKvNS9d5u8tzM1N8DHONeETwsBykpMvzjQLvWkovdR7drf1PVcp34iCdRNxLrPtYRM2M%2Bsb3EZ1OpxLzHkmsjsSrfDvGMt8p5ql7Oa%2Bg6HEquLcRy5J3sGEecLKQSyx5Drq3EcuT27qBu%2BaykEjH2L9eWYjnye3VUrlKJWPu%2BcL21WI42jHZY7lKJmPu9cJ2CWI52WDuO21MK2UslYtvkyv%2FCNQ8P%2FUvaCIdc3LXxrXt934tUIsc9lT5QoeusPmfakBG5XGQtVZenf1mtolxxSFVTAgTIlb1UXa5qF2K5pOKEjkg85Kr3IFWX797L9YlyY%2B2NtoQJuc4UgQ2kerHkKygn2H6RNtpG02BErpKU2UCqiyVffqcbeLgLjLbRNGGlyz8TOa6xc%2FTyXdhOQbnBw%2FM%2FJWVCTLkSkirPIkvLimR1Ii6GXAlJVVGu9NeEMkRTLkilBA8L4c6UIRpyQSpFLB2S7QXPJXJBKmXY%2FoCmKDeJXYM5ckGqSLD9sXKHkAtSRYTdjwzZtVyQagUOJtdXtn9LQ6oYHEguhlQrc1C5aki1AgeUK8plE0hl4WByqYs1IhVuF3kguWrWrYq48DQqT9DIFsgVHPvC%2FkAuhlw%2BMS8OgZrSpDvksgC5JmNdHOJUYp5XyGUBcjljXHhCKjFvCbksQK7Bshf2lEosA7lsQK7%2Fl7lwoFRiWZtcOBVxdLlY4eSnQ67PdHSOKpeGVCJWf0D%2FTuBwclXsfrpsRTPh4U1NCgKHr4pYJFWXq4ZYDvYmF%2Fs90WKxVF2uGmKNsEO5pr61KlIAYnmwJ7kmxKpICYjlyV7kcqyDqlSOPAUBO7nLxfZbCTWo%2F%2B4SYgWSq1w8XvryjZSBWDPITS7eoEgPYs0kF7l4vJw4mlwQawGpyzUiVcX2RxmryQWxFpKqXOxXpFfGkgtiKZCaXJxAkR4Pd7X5P4ViC1KQi9tLNldfqcRyLrlm%2FYTM0oaaVuZEO4Lbr%2FvmnFDR%2B%2Bh2Op1%2BowC6%2F%2FCrmULuhV443v%2FD5K9oPF9pXmz%2FBB8U9vzsJxo%2Bfzt4%2FUEPjW%2BukRhzqALylqxPzRhf6cAL5GI9qZoxTvCTH7iVy6cCwoea9%2F4U%2B7XhGXKxjlQ1t6cTZg%2BWu3bceL5g70vbsJRdjbH68MiYy0y%2Fm3HHh8e8X8xUkQcm3r%2BkTCdHiCAfcr1AJNj9LdS899b9Z98d%2F%2Fk3AsAFz9vF3QiAKQLlws%2BlQBjdrs8lWHOjjfye4Zcgux68j8Ht0zKaQ%2FFmYNwMdr%2BbQe8%2FBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASfAfQWaAgS7EyI8AAAAASUVORK5CYII%3D
