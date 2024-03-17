# window-postgres-installer

A helper package to install Postgresql binaries on a window system.

## Usage

```bash
npm i window-postgres-installer
```

```ts
import { 
    installPostgres,
    getPostgresBinaries,
    isPostgresInstalled 
} from 'window-postgres-installer'

async function main() {
    await installPostgres()
}

/* 
* use `getPostgresBinaries` to get the file path to the postgres binaries
* use `isPostgresInstalled` to check if the postgres binaries are installed
*/

main()
```

> **NOTE:** The binaries are installed in the ***AppData/Roaming/node-embedded-postgres*** directory

## Credits

This package will not be possible without [zonky's embedded-postgres-binaries](https://github.com/zonkyio/embedded-postgres).
