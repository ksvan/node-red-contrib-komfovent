# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Addedd

- Supporting more specific fan modes with timeouts
- Screen scraping support datafields from the other pages as well (those in iframes on the main page)
- screen scraping, specifically figure out which settings are enabled/disabled
- config of setter node, to be a predefined action on any input. simplfy use in flows
- add unit/integration tests

### Changed
- Moving to promises requests, async awaits for better readability. away from old call back pattern
- validate logon better, by parsing returned body
- screen scraping, remove data unit definiton from returns, ie % C etc
- move duplicated code into separate modules (komfologon, scraping). Also make it easier to use komfovent logic outside of nodered

### Fix
- displayName issue for configuration nodes
- moving error msgs to shared constants
- consistency in return object, always using result: and not details: for errors

## [0.3.3]

### Addedd
- Simple unit testing w mocking

### Changed
- Dependencies update, incl devdep
- Updates for node >1.x. Breaking changes for nodered installs <1.0. Specifically for error handling and sending

### Fixed
- consistency in logging categories, warn vs error

## [0.3.2] 30.05.19

### Fix
- dependency issues, incl cherios - main release reason
- wrong password crash
- callback improvements

### Changed
- error handling, removed some debug and changed returned objects

### Added 
- automated testing started

## [0.3.1] 14.10.2018

### Added
- Getter node, fetch data from page
- Screen scraping of key values and settings (getter node) (implies new dependency, Cheerio)
- Screen scraping support datafields from det.html as well (iframe in main page. Values containing _ is fetched from this one instead)
- Getter node html interface node red
- Reverse and readme info on the id of the different fields/values that can be read

### Changed
- Changed komfologon method, no need to pass on msg object anymore 
- Added a lot more reverse engineering info - reverse.md
- name field/value for config object, in case you want multiple


## [0.2.0]
### Addedd
- mode switching feature 

## Fixed
- Logon instability issues fixed

## [0.1.0]
### Addedd
- inital structure and package
- logon feature

