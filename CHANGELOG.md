## [1.1.6](https://github.com/ffflorian/my-timezone/compare/v1.1.5...v1.1.6) (2026-07-10)


### Bug Fixes

* **deps:** Bump node from 26.4.0-alpine to 26.5.0-alpine ([#154](https://github.com/ffflorian/my-timezone/issues/154)) [ci skip] ([7bb2852](https://github.com/ffflorian/my-timezone/commit/7bb28528e20d9b796aded9a8a95982749720f191))

## [1.1.5](https://github.com/ffflorian/my-timezone/compare/v1.1.4...v1.1.5) (2026-06-26)


### Bug Fixes

* **deps:** Bump nginx from `81595dd` to `54f2a90` ([#136](https://github.com/ffflorian/my-timezone/issues/136)) [ci skip] ([e116128](https://github.com/ffflorian/my-timezone/commit/e11612807a4f4b74dbee38a3786a92ec79429e15))
* **deps:** Bump node from 26.3.1-alpine to 26.4.0-alpine ([#135](https://github.com/ffflorian/my-timezone/issues/135)) ([3d041f3](https://github.com/ffflorian/my-timezone/commit/3d041f383f2540de66342a418f8228a5c2ec096e))

## [1.1.4](https://github.com/ffflorian/my-timezone/compare/v1.1.3...v1.1.4) (2026-06-18)


### Bug Fixes

* **deps:** Bump nginx from 1.31.1-alpine to 1.31.2-alpine ([#128](https://github.com/ffflorian/my-timezone/issues/128)) [ci skip] ([78bbd8f](https://github.com/ffflorian/my-timezone/commit/78bbd8f29ce3a572de3b8e0639340de6ae55acd0))
* **deps:** Bump node from 26.2.0-alpine to 26.3.1-alpine ([#127](https://github.com/ffflorian/my-timezone/issues/127)) ([fa99c79](https://github.com/ffflorian/my-timezone/commit/fa99c795c5fbee06fce4a414682bddedf02e1e74))
* **deps:** Bump undici from 7.25.0 to 7.28.0 ([#132](https://github.com/ffflorian/my-timezone/issues/132)) [ci skip] ([66121e4](https://github.com/ffflorian/my-timezone/commit/66121e486c6e0d45af466cf26c95f7ec21c4e4b3))

## [1.1.3](https://github.com/ffflorian/my-timezone/compare/v1.1.2...v1.1.3) (2026-06-17)


### Bug Fixes

* **deps:** Bump js-yaml from 4.1.1 to 4.2.0 [ci skip] ([ebe41c9](https://github.com/ffflorian/my-timezone/commit/ebe41c9b8e0302edea53e4e863c417752ce562b4))
* **deps:** Bump tar from 7.5.13 to 7.5.16 ([#125](https://github.com/ffflorian/my-timezone/issues/125)) ([d7e1b3c](https://github.com/ffflorian/my-timezone/commit/d7e1b3ccd944a007f7776951609f812ee54c5cba))
* **deps:** Bump vite from 8.0.14 to 8.0.16 ([0659207](https://github.com/ffflorian/my-timezone/commit/065920712dfb59b6aa1a75c8db2354bbac2b9ca7))

## [1.1.2](https://github.com/ffflorian/my-timezone/compare/v1.1.1...v1.1.2) (2026-06-11)


### Bug Fixes

* Install yarn with apk ([#121](https://github.com/ffflorian/my-timezone/issues/121)) ([d1ec949](https://github.com/ffflorian/my-timezone/commit/d1ec949401ed49cfb1f8c60cb9b4ca1de6a561ee))

## [1.1.1](https://github.com/ffflorian/my-timezone/compare/v1.1.0...v1.1.1) (2026-06-11)


### Bug Fixes

* **deps:** Bump the react group across 1 directory with 2 updates ([#116](https://github.com/ffflorian/my-timezone/issues/116)) ([21f02d9](https://github.com/ffflorian/my-timezone/commit/21f02d9800286112bf33aedc15169cb5dd9fe978))

# [1.1.0](https://github.com/ffflorian/my-timezone/compare/v1.0.0...v1.1.0) (2026-06-06)


### Features

* add VERSION/COMMIT build args and update @ffflorian/actions to v1.26.0 ([#111](https://github.com/ffflorian/my-timezone/issues/111)) ([bbe5cdc](https://github.com/ffflorian/my-timezone/commit/bbe5cdcb7989c9e1b6780aaa2e3b70d339ec8d5b))

# 1.0.0 (2026-05-27)


### Bug Fixes

* Add health endpoint ([1dd7859](https://github.com/ffflorian/my-timezone/commit/1dd7859688539deef57202d133280086b0b4a9e8))
* configure Vitest jsdom environment to fix failing tests ([#14](https://github.com/ffflorian/my-timezone/issues/14)) ([e4928b1](https://github.com/ffflorian/my-timezone/commit/e4928b135331c7ef37462f462bc90e5be5254487))
* correct Vite base path for GitHub Pages deployment ([#16](https://github.com/ffflorian/my-timezone/issues/16)) ([b3fb1b8](https://github.com/ffflorian/my-timezone/commit/b3fb1b8d82bc3dc8585edbd26d841685edd354aa))
* display solar time in UTC, not browser local timezone ([#30](https://github.com/ffflorian/my-timezone/issues/30)) ([735ef68](https://github.com/ffflorian/my-timezone/commit/735ef6810b5735c95d403f2d2a2017916a7fae23))
* Main page text ([f0ec399](https://github.com/ffflorian/my-timezone/commit/f0ec39963f64edde330aedb1897155a2db990227))
* restore vitest jsdom environment config in vite.config.ts ([#47](https://github.com/ffflorian/my-timezone/issues/47)) ([6e691be](https://github.com/ffflorian/my-timezone/commit/6e691be93f94830839ed84362668f0bd66ebd110))
* revert to solar mean time display, remove LocationInfo component ([#34](https://github.com/ffflorian/my-timezone/issues/34)) ([0acce3e](https://github.com/ffflorian/my-timezone/commit/0acce3e86c2b87b62cca2ed07be224c6fa3aab9d))
* Use localStorage from window ([#88](https://github.com/ffflorian/my-timezone/issues/88)) ([4ba4ce1](https://github.com/ffflorian/my-timezone/commit/4ba4ce1e158a4003822ab8549611ee9ef5d9283b))


### Features

* add "My Timezone" heading and intro text above map placeholder ([#20](https://github.com/ffflorian/my-timezone/issues/20)) ([886d944](https://github.com/ffflorian/my-timezone/commit/886d9440a33a56df30e3a39c42d3e3da435a8075))
* add "or" divider between location input sections ([#41](https://github.com/ffflorian/my-timezone/issues/41)) ([094b2d8](https://github.com/ffflorian/my-timezone/commit/094b2d8a9665c773d55089e8afe675b061e0881f))
* add city name location search input ([#27](https://github.com/ffflorian/my-timezone/issues/27)) ([9fe6df7](https://github.com/ffflorian/my-timezone/commit/9fe6df7aab02908c5e805f98449b8ab3a13a85ca))
* add favicon/logo assets and Open Graph meta tags ([#32](https://github.com/ffflorian/my-timezone/issues/32)) ([892f0e6](https://github.com/ffflorian/my-timezone/commit/892f0e649daefffcadfb44f621d4f6398eb4e609))
* add GitHub link button to header ([#35](https://github.com/ffflorian/my-timezone/issues/35)) ([de39d2c](https://github.com/ffflorian/my-timezone/commit/de39d2c8883d23698bf9a1165309dd73f318bd94))
* add interactive Map component with Leaflet and location detection ([#21](https://github.com/ffflorian/my-timezone/issues/21)) ([ba5b10b](https://github.com/ffflorian/my-timezone/commit/ba5b10b6c3f0516e02b893c4a2b96c7a5afe2fa1))
* basic design with coordinate inputs and solar time display ([#18](https://github.com/ffflorian/my-timezone/issues/18)) ([af1e09b](https://github.com/ffflorian/my-timezone/commit/af1e09bf88520e057c1b0eda9a28f2bf6ba99995))
* center map on Europe on initial load ([#43](https://github.com/ffflorian/my-timezone/issues/43)) ([c94909b](https://github.com/ffflorian/my-timezone/commit/c94909b6e818bb0ab582680ad9482cc6cd8aa4f2))
* Clock and LocationInfo components ([#28](https://github.com/ffflorian/my-timezone/issues/28)) ([49be299](https://github.com/ffflorian/my-timezone/commit/49be2994f052bd95e9a995afc9ef76dde75c5307))
* disable buttons when there is no input ([#45](https://github.com/ffflorian/my-timezone/issues/45)) ([a0bc57d](https://github.com/ffflorian/my-timezone/commit/a0bc57d420499e69b24b0720288eddb00bf12576))
* light/dark theming with CSS custom properties and localStorage persistence ([#24](https://github.com/ffflorian/my-timezone/issues/24)) ([6193a87](https://github.com/ffflorian/my-timezone/commit/6193a874f960edf26031fcd11ac1b44b8df15746))
* make map interactive - click to update location and solar time ([#26](https://github.com/ffflorian/my-timezone/issues/26)) ([75f8ef4](https://github.com/ffflorian/my-timezone/commit/75f8ef4f5ac9da56045fb913f8074d1a15149f06))
* replace emojis with Bootstrap Icons ([#37](https://github.com/ffflorian/my-timezone/issues/37)) ([5506a23](https://github.com/ffflorian/my-timezone/commit/5506a23f9c4bf0a3ea18786ecec1dcfa8f46f12c))
* Update text on main page ([dbe44ee](https://github.com/ffflorian/my-timezone/commit/dbe44eef8642689d7939878f83ac4191c4ae1ea6))
