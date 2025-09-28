## Quick orientation for code suggestions in this repo

This project is a small Node-RED contrib package that integrates with Komfovent C6 controllers by mimicking the controller's web requests and scraping pages. Keep suggestions tight, concrete and aligned with existing patterns below.

### Big picture
- Node-RED package exposing three node types implemented in `komfnodes/`.
- `komfnodes/komfovent.js` is the core integration class: stateless helper with async methods that perform HTTP calls and return simple JSON result objects.
- `komfnodes/config.js` is the config (credentials + mode code map) node. `komfnodes/getter.js` and `komfnodes/setter.js` are the flow nodes that call the class.
- Communication with the device is plain HTTP: login is POST to `/` with body `1=<user>&2=<pwd>`, mode changes are POST to `/ajax.xml` with the mode code string (e.g. `3=2` or `285=2`), reads are GET `/` or `/det.html` and parsed with Cheerio.

### Key files to reference
- `komfnodes/komfovent.js` — core methods: `logon(username,password,ip)`, `setMode(mode,ip)`, `getId(id,ip)`, `getMode(ip)`, `getData(name,ip)`, `makeRequest(postConfig)`.
- `komfnodes/config.js` — config node holding `ip`, `displayName`, and `mode` mapping strings (`home: '3=2'`, ...).
- `komfnodes/getter.js` and `komfnodes/setter.js` — how Node-RED nodes are registered and how they consume `node.komfoUser` config and `credentials`.
- `package.json` — node-red node mappings are under `node-red.nodes`: keep this in sync when you add nodes.
- `test/` and `tests/` — unit + node runtime tests using `mocha`, `nock` and `node-red-node-test-helper` (see patterns for mocking below).

### Developer workflows & commands
- Install deps: `npm install`.
- Run linters + tests (default): `npm test` — runs `eslint` against `komfnodes/*.js` (pretest) then `mocha "test/**/*_spec.js"`.
- Run tests only (skip package.json pretest): `npx mocha "test/**/*_spec.js"`.
- Run Node-RED for manual testing: link the package into your `.node-red` and restart Node-RED (see README). Typical flow: `npm link` from this package, then in `~/.node-red` run `npm link node-red-contrib-komfovent` and restart Node-RED.
- Integration tests: tests are mocked by default. To run the integration flow you must allow network access and provide env vars used in tests: `INTEGRATION=1 INTEGRATION_IP=<ip> INTEGRATION_USER=<user> INTEGRSATION_PWD=<pwd> npm test` (note: test code expects `INTEGRSATION_PWD` with this exact misspelling).

### Project-specific conventions & patterns
- Nodes always retrieve a config node via `RED.nodes.getNode(config.user)` and expect credentials on `node.komfoUser.credentials` and `node.komfoUser.ip` — validate presence early and `node.error()` if missing (see `getter.js` & `setter.js`).
- Mode mapping is stored as plain strings on the config object (`this.mode = { home: '3=2', ... }`) — when adding modes, edit `komfnodes/config.js` and update any docs/tests.
- Input payloads are simple strings: for setter nodes use mode names (`'intensive'`, `'boost'`, `'auto'`); for getter nodes use field IDs (`'ai0'`, `'v_s1'`).
- Return value contract from the Komfovent class: an object shaped like `{ error: boolean, result: <string>, unit?: <ip> }`. Keep this shape when adding helpers.
- Scraping nuance: if requested id contains an underscore the getter fetches `det.html` instead of the root page. Cheerio is used and does not support iframes — do not attempt to extract iframe content.

### Tests & mocking notes (important for generating changes)
- Tests disable real network by default: `nock.disableNetConnect()` is used. Use `nock` to mock HTTP responses in unit tests.
- The test runner expects local fixtures under `test/` (e.g. `index.html`, `det.html`, `ajax.xml`) and uses `replyWithFile` in `nock` intercepts.
- Use `node-red-node-test-helper` for Node-RED runtime tests — see `tests/test_getter_spec.js` for the pattern: define a flow array, credentials object, load nodes, and assert messages.

### Networking & security details to keep in mind
- The controller uses non-SSL HTTP only; login uses a form-style body `1=user&2=pwd` and always returns HTTP 200 even on auth failure — code checks the returned HTML for strings like `Incorrect password!` or `value="Logout"`.
- Mode toggles: some modes (auto/eco) behave as toggles on the device. Calling them twice may revert state; the README shows an approach (global context flag) for flow-level handling.

### When you add a new node
1. Add `komfnodes/<yournode>.js` following the existing `module.exports = function(RED) { ... RED.nodes.registerType(...) }` pattern.
2. If the node needs a config node, reuse `komfnodes/config.js` pattern for credentials and modes.
3. Add the node mapping to `package.json` under `node-red.nodes` and update README/tests that reference it.
4. Ensure new files pass `eslint` (pretest) and add unit tests using `nock`/`node-red-node-test-helper`.

### Where to look for more context
- `README.md` — high-level usage and installation.
- `reverse.md` — reverse-engineering notes and rationale for HTTP/scraping design decisions.
- `test/` and `tests/` — concrete examples of mocking and Node-RED runtime tests.

If anything in this file is unclear or you want more examples (e.g., a template test for a new node, or a checklist for adding a node), tell me which part to expand and I'll iterate.
