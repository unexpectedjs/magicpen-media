### v2.0.0 (2019-06-23)

#### Pull requests

- [#19](https://github.com/unexpectedjs/magicpen-media/pull/19) Upgrade nyc to version 14.0.0 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#18](https://github.com/unexpectedjs/magicpen-media/pull/18) Upgrade magicpen to version 6.0.2 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#16](https://github.com/unexpectedjs/magicpen-media/pull/16) Upgrade mocha to version 6.0.0 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#15](https://github.com/unexpectedjs/magicpen-media/pull/15) Upgrade unexpected to version 11.0.0 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))

#### Commits to master

- [Tidy up](https://github.com/unexpectedjs/magicpen-media/commit/cfb0b4f69b102324b19912aacef21648d5bee851) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Fix lint](https://github.com/unexpectedjs/magicpen-media/commit/ace8af4df04d1eeff73e18e6c19161ab490bff30) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Drop node.js 6 support, add 8, 10, and latest \(semver-major\)](https://github.com/unexpectedjs/magicpen-media/commit/e5026cabbc4523eed290ae244f226f3cdd10eeb2) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Update eslint to version 6.0.0](https://github.com/unexpectedjs/magicpen-media/commit/6f707e8ff972eabb77f7b820bc74a78b3ef4005e) ([depfu[bot]](mailto:23717796+depfu[bot]@users.noreply.github.com))

### v1.5.2 (2018-11-19)

#### Pull requests

- [#14](https://github.com/unexpectedjs/magicpen-media/pull/14) Add license file and license property in package.json ([Gustav Nikolaj Olsen](mailto:gno@one.com))
- [#12](https://github.com/unexpectedjs/magicpen-media/pull/12) Upgrade sinon to version 7.1.0 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#4](https://github.com/unexpectedjs/magicpen-media/pull/4) Upgrade browserify to version 16.2.3 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#6](https://github.com/unexpectedjs/magicpen-media/pull/6) Upgrade coveralls to version 3.0.2 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#2](https://github.com/unexpectedjs/magicpen-media/pull/2) Upgrade lodash to version 4.17.11 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [#1](https://github.com/unexpectedjs/magicpen-media/pull/1) Upgrade gettemporaryfilepath to version 1.0.0 ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))

#### Commits to master

- [Update mocha to version 5.2.0](https://github.com/unexpectedjs/magicpen-media/commit/90fbef08cbd45d97de159ccf5d1c6dad7aeabe2d) ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [Update bundle-collapser to version 1.3.0](https://github.com/unexpectedjs/magicpen-media/commit/3fba7b5b10c834496fe63c3442934fc3f516c166) ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [Adapt to API differences in the new version of the mime library](https://github.com/unexpectedjs/magicpen-media/commit/e39a6d09ea0894a367693d57950b30ead866b0a0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [Update mime to version 2.3.1](https://github.com/unexpectedjs/magicpen-media/commit/a74b3dccec1533cedb2e63a502d5cb8692ab8f82) ([depfu[bot]](mailto:depfu[bot]@users.noreply.github.com))
- [Adapt to the HTML serialization differences of the new magicpen](https://github.com/unexpectedjs/magicpen-media/commit/5d810473d80f249a21fc44d414f2ae5d4e54eaa8) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
- [+22 more](https://github.com/unexpectedjs/magicpen-media/compare/v1.5.1...v1.5.2)

### v1.5.1 (2015-08-19)

- [Include the version number in the plugin spec object.](https://github.com/unexpectedjs/magicpen-media/commit/7838e64e209ae0cb6d88e0e55c901cee52fccab4) ([Andreas Lind](mailto:andreas@one.com))

### v1.5.0 (2015-07-06)

- [Added support for linking the media to itself or an arbitrary url.](https://github.com/unexpectedjs/magicpen-media/commit/d9b727ceb54b0f975b38e33cfbb2226c5d4669d9) ([Andreas Lind](mailto:andreas@one.com))

### v1.4.0 (2015-07-06)

- [If the media to render is given as a string and isn't a data: url, try to look up the extension in the mime library to find the Content-Type.](https://github.com/unexpectedjs/magicpen-media/commit/c684ada058eca643688283fcf0d1043a8a09264b) ([Andreas Lind](mailto:andreas@one.com))
- [Implemented fallbackToDisc option.](https://github.com/unexpectedjs/magicpen-media/commit/ee63ab1432789bedbcc3e792cab539d20b34f58b) ([Andreas Lind](mailto:andreas@one.com))
- [Improve rendering of data urls in text mode.](https://github.com/unexpectedjs/magicpen-media/commit/0994238fe8bdaec4559837b62da7f0117b4390e2) ([Andreas Lind](mailto:andreas@one.com))

### v1.3.1 (2015-07-06)

- [Improve copy\/pastability of urls in text mode.](https://github.com/unexpectedjs/magicpen-media/commit/29b33f33ebe780d98cbc6320cb633989dac096cb) ([Andreas Lind](mailto:andreas@one.com))

### v1.3.0 (2015-07-06)

- [HTML mode: If the media is passed as a path\/url \(except data:\), specify it as the title as well.](https://github.com/unexpectedjs/magicpen-media/commit/429490e3319d7dbe382cf8c2e7ab50a160c91187) ([Andreas Lind](mailto:andreas@one.com))
- [Support a title passed in the options object.](https://github.com/unexpectedjs/magicpen-media/commit/b35623a76af5fa0001ce94dbf5fdf468b5424a77) ([Andreas Lind](mailto:andreas@one.com))
- [Support an alt text passed in the options object.](https://github.com/unexpectedjs/magicpen-media/commit/645403c6898b09a317f1c783a3fae3c639c286eb) ([Andreas Lind](mailto:andreas@one.com))
- [Refactored the HTML attribute serialization slightly.](https://github.com/unexpectedjs/magicpen-media/commit/7b1bb1f9ef1b9ef286c4134a40f3a7b0779346fb) ([Andreas Lind](mailto:andreas@one.com))

### v1.2.0

- [Update magicpen to 4.12.0.](https://github.com/unexpectedjs/magicpen-media/commit/4a493ab900d0c7f4b34cffd6fed4e1bd5a508afa) ([Andreas Lind](mailto:andreas@one.com))
- [Drop the magicpen peer dependency.](https://github.com/unexpectedjs/magicpen-media/commit/bf48247e5419a8434b2d4764ba1fc298e9e1e329) ([Andreas Lind](mailto:andreas@one.com))
- [Use magicpen.alt instead of magicpen.raw.](https://github.com/unexpectedjs/magicpen-media/commit/1252000d88d2107347177ef4829d9648ce79403f) ([Andreas Lind](mailto:andreas@one.com))
- [Removed outdated comment.](https://github.com/unexpectedjs/magicpen-media/commit/04b6746175f9da0edae1012d380bcba341cacd0b) ([Andreas Lind](mailto:andreas@one.com))

### v1.1.1 (2015-07-06)

- [Improve fallback output.](https://github.com/unexpectedjs/magicpen-media/commit/b3ad554d90beead1c321624e291c39a49c8a20b0) ([Andreas Lind](mailto:andreas@one.com))
- [Fixed missing newline at EOF.](https://github.com/unexpectedjs/magicpen-media/commit/0e2f84602c793aedf165f7fb9bf33a634ad37fe6) ([Andreas Lind](mailto:andreas@one.com))
- [Improved README slightly.](https://github.com/unexpectedjs/magicpen-media/commit/fb6921b34056b485349175910ae8647206f0f669) ([Andreas Lind](mailto:andreas@one.com))

### v1.1.0

- [Full coverage.](https://github.com/unexpectedjs/magicpen-media/commit/8a0e42f21a0dfa78041e93d40de677e53083f1f5) ([Andreas Lind](mailto:andreas@one.com))
- [Accept an options object that can contain height, width, and type properties.](https://github.com/unexpectedjs/magicpen-media/commit/f34a5ce4b37e33218070f51327189b4bd909f4e1) ([Andreas Lind](mailto:andreas@one.com))
- [Update magicPenMedia.js](https://github.com/unexpectedjs/magicpen-media/commit/6a82bbe0a475ca88b607940afcd520ef169ce35a) ([Andreas Lind](mailto:andreas@one.com))
- [Update magicPenMedia.js](https://github.com/unexpectedjs/magicpen-media/commit/505c06312991d9f8104a8f215641fbeeba096557) ([Andreas Lind](mailto:andreas@one.com))
- [Create README.md](https://github.com/unexpectedjs/magicpen-media/commit/7535e380965c850b40ab1b9b2303696ac4f48334) ([Andreas Lind](mailto:andreas@one.com))
- [+1 more](https://github.com/unexpectedjs/magicpen-media/compare/v1.0.0...v1.1.0)

### v1.0.0

- [Initial commit, 1.0.0.](https://github.com/unexpectedjs/magicpen-media/commit/40cd7f7bfc3002ada234ff2b70b9434de41e9ebc) ([Andreas Lind](mailto:andreas@one.com))
