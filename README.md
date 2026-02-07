<div align="center">

# Wiki-bot

**A zero-dependency mediawiki API client for JavaScript.**

[![GitHub](https://img.shields.io/github/license/arzeh/wiki-bot)](https://github.com/arzeh/wiki-bot/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/wiki-bot?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/wiki-bot)

</div>

## Description

This library allows to query and perform actions on MediaWiki-based
wikis. You can query page lists, edit pages, delete them, upload files,
and any action that MediaWiki supports through its API.

**This project is actively evolving.** Although the API is expected to
remain stable and focus mostly in finding edge-cases or supporting other
API actions, breaking changes may occur until 1.0. Some types haven't been
verified to match the actual API response; if you find any error, please
submit an issue. The current version does not handle errors, but it is intended
to do so in a future version.

## Features

- Use all common query modules (like listing all pages or getting a list of page's categories).
- **Zero dependencies.**
- Written in TypeScript.

## Installation

``` sh
npm install wiki-bot
yarn add wiki-bot
```

## Usage

``` ts
import { Wiki } from 'wiki-bot';

function main() {
  const wiki = new Wiki('https://mywiki.com/api.php');
  const allpages = await wiki.allpages({
    apfrom: 'A',
    aplimit: 'max',
    apto: 'B',
  });
  const titles = allpages.map(page => page.title);
  console.log(titles);
}
```

Calling the previous function will print in the console a list of page titles.

## License

GNU General Public License version 3.
