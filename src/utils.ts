import { readJSON, pathExists } from "fs-extra/esm"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import appDataPath from "appdata-path"
const { getAppDataPath } = appDataPath

export type PostgresBinaries = { [binary in "pg_ctl" | "initdb" | "postgres"]: string }

/**
 * Get the file path to the postgres binaries.
 */
export async function getPostgresBinaries(): Promise<Partial<PostgresBinaries>> {
    if (await isPostgresInstalled()) {
        const embeddedPostgresPath = getAppDataPath("node-embedded-postgres")

        return {
            pg_ctl: join(embeddedPostgresPath, "bin/pg_ctl.exe"),
            initdb: join(embeddedPostgresPath, "bin/initdb.exe"),
            postgres: join(embeddedPostgresPath, "bin/postgres.exe")
        }
    }

    return {
        pg_ctl: undefined,
        initdb: undefined,
        postgres: undefined
    }
}

/**
 * Check if the postgres binaries are installed.
 * @returns {boolean}
 */
export async function isPostgresInstalled(): Promise<boolean> {
    const __dirname = dirname(fileURLToPath(import.meta.url))

    let postgresInstalledFilesPath = join(__dirname, "../", "resource/postgres-installed-files.json")

    if (!(await pathExists(postgresInstalledFilesPath))) {
        return false
    }

    let postgresInstalledFiles = await readJSON(postgresInstalledFilesPath)

    for await (const filePath of postgresInstalledFiles) {
        if (!(await pathExists(filePath))) {
            return false
        }
    }

    return true
}