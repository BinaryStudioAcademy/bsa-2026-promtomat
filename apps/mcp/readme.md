# Promptomat MCP server

A local [Model Context Protocol](https://modelcontextprotocol.io/) server that lets a coding agent act as a Promptomat user. The agent starts it on your machine and talks to it over stdio; the server talks to the Promptomat API with your API token. It is installed, not run from a checkout: you do not need this repository.

## Requirements

- [Node.js](https://nodejs.org/en) 20 or later, with npm
- A Promptomat API token (Settings → Security)
- A coding agent that can start a local stdio MCP server. The steps below are for Claude Code.

## Install

```sh
npm i -g https://github.com/BinaryStudioAcademy/bsa-2026-promtomat/releases/latest/download/promptomat-mcp.tgz
```

## Connect

The settings card shows this command beside a freshly created API token, with both values filled in. Written by hand it is:

```sh
claude mcp add --scope user promptomat -e PROMPTOMAT_API_URL='https://<your-promptomat-host>/api/v1' -e PROMPTOMAT_API_TOKEN='<your-api-token>' -- promptomat-mcp
```

- `PROMPTOMAT_API_URL` is the API base including `/api/v1`, not the address of the web app.
- `--scope user` keeps the token in the client's configuration in your home directory. Do not move it into a project-level configuration file: those get committed.
- The connect command leaves a copy of the token in your shell history.
- The values are quoted for a POSIX shell (bash, zsh).
- Any other stdio-capable client works with the same command, `promptomat-mcp`, and the same two variables.

Then restart the client: it starts the server when it starts.

## Verify

Ask the agent to call `whoami`. The answer names the running version and the user the token belongs to:

```text
promptomat-mcp <version>: authenticated as <nickname> (<email>), user id <id>
```

## Tools

- `whoami`: reports the user and server version the token is authenticated as. Useful for checking the connection is working (see Verify above).
- `resolve_repository`: checks which workspace the current checkout is bound to, by reading its git remotes. Call it before composing or searching prompts, to know the current workspace. Accepts an optional `remoteName`, needed only when the checkout's remotes point to more than one distinct repository.
- `bind_repository`: binds the current checkout to a workspace, so future calls resolve to it. Call it after `resolve_repository` reports the checkout as unresolved or ambiguous, passing the `workspaceId` to bind to. Also accepts an optional `remoteName`, for the same multi-repository case. Detects the project's technologies from `package.json` and records them on the workspace.

## Update

Re-run the install command, then restart the client. Nothing announces a new version; `whoami` tells you which one is running.

## Troubleshooting

There are two kinds of failure. A server that cannot start, the first two entries below, never reaches the agent: the client reports the server as failed and the agent has no Promptomat tools. A server that runs never ends the session because of a failed call: each of the last three entries is an answer the agent reads, and the next call is tried afresh, so a backend that comes back needs no restart. A changed variable does need one: remove the server (`claude mcp remove promptomat`), run the connect command again and restart the client.

Diagnostics go to stderr as JSON lines, never to stdout. To read them directly, start the server by hand with the two variables set (`Ctrl+C` stops it):

```sh
PROMPTOMAT_API_URL='https://<your-promptomat-host>/api/v1' PROMPTOMAT_API_TOKEN='<your-api-token>' promptomat-mcp
```

### The client cannot start the server, or `promptomat-mcp: command not found`

- The npm global bin directory is not on the `PATH` the client uses. `npm prefix -g` prints the prefix; the command is in its `bin` directory. Add that directory to the `PATH`, or pass the full path to the command instead of `promptomat-mcp` in the connect command.
- Node.js was switched with a version manager. Global packages belong to the Node.js version that installed them: run the install command again under the version the client uses.

### A variable is missing or malformed

The server stops at once with exit code 1, before it connects to the client, and writes one JSON line to stderr. Its `msg` names the variable, `PROMPTOMAT_API_TOKEN` or `PROMPTOMAT_API_URL`; when both are wrong, the message lists both, one per line:

```text
API.TOKEN: Missing required environment variable PROMPTOMAT_API_TOKEN
```

A value that is present but malformed is reported the same way. A rejected URL is echoed after `value was`, for example a URL typed without its scheme; a rejected token never is:

```text
API.URL: PROMPTOMAT_API_URL must be an absolute http(s) URL: value was "localhost:3001/api/v1"
API.TOKEN: PROMPTOMAT_API_TOKEN must contain only printable ASCII characters without spaces
```

### The backend is unreachable

```text
The Promptomat API at <url> is unreachable (ECONNREFUSED). Check PROMPTOMAT_API_URL and that the backend is running.
```

The brackets hold the cause: a network error code such as `ECONNREFUSED` or `ENOTFOUND`, `the request timed out` after 10 seconds, or `the network request failed` when the runtime reports no code.

### The URL points at the web app

```text
The Promptomat API at <url> answered 200 with a body that is not the expected JSON. Check that PROMPTOMAT_API_URL is the API base including /api/v1.
```

The web app answers every address outside `/api` with its own page, so a URL without `/api/v1` looks alive and is not the API.

### The token was rejected

```text
The Promptomat API rejected the token. Check PROMPTOMAT_API_TOKEN or create a new token in Settings → Security.
```

The text is deliberately the same whatever is wrong with the token.

## Releasing

For maintainers. The package is not published to a registry: a release is a tarball attached to a GitHub release of this repository, and the install command downloads it through the stable `releases/latest/download/promptomat-mcp.tgz` link.

1. Bump `version` in `apps/mcp/package.json` with an ordinary commit. The release tag is `mcp-v<version>` and has to match it.
2. Build and pack from the repository root. `pnpm pack`, not `npm pack`: pnpm replaces the `workspace:` protocol in the packed manifest.

   ```sh
   pnpm install
   pnpm --filter @promptomat/mcp build
   cd apps/mcp
   pnpm pack
   mv promptomat-mcp-<version>.tgz promptomat-mcp.tgz
   ```

3. Create a GitHub release tagged `mcp-v<version>`. A normal release: not a draft and not a pre-release, because the stable link resolves to the latest non-pre-release release of the whole repository. For the same reason every later release of this repository has to carry the asset.
4. Attach `promptomat-mcp.tgz` under exactly that name.
5. Run the install command, restart the client and ask the agent for `whoami`: it reports the new version.
