import AdmZip from "adm-zip"
import { existsSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import appDataPath from "appdata-path"
const { getAppDataPath } = appDataPath
import _7zip from "7zip-min"
import { dirname, join } from "node:path"
import { isPostgresInstalled } from "./utils.js"
import { ensureDirSync, removeSync } from "fs-extra/esm"

const extractZip = function (pathToArchive: string, whereToUnpack: string) {
    return new Promise<void>((resolve, reject) => {
        _7zip.unpack(pathToArchive, whereToUnpack, (err) => {
            if (!err) {
                resolve()
            } else {
                reject(err)
            }
        })
    })
}

/**
 * Install postgres binaries.
 */
export default async function installPostgres() {
    if (await isPostgresInstalled()) {
        return
    }

    const __dirname = dirname(fileURLToPath(import.meta.url))

    let packedJarFilePath = join(__dirname, "../", "resource/embedded-postgres-binaries-windows-amd64-15.5.0.jar")
    if (!existsSync(packedJarFilePath)) {
        throw new Error("Postgres archive file missing")
    }

    const unpackedJar = new AdmZip(packedJarFilePath)
    const archive = unpackedJar.getEntries().find((f) => f.entryName.endsWith('txz'))

    if (!archive) {
        throw new Error("Could not find archive containing binaries in embedded-postgres-binaries-windows-amd64-15.5.0.jar")
    }

    const data = archive.getData()

    const embeddedPostgresPath = getAppDataPath("node-embedded-postgres")

    ensureDirSync(embeddedPostgresPath)

    writeFileSync(join(embeddedPostgresPath, "native.txz"), data)

    try {
        await extractZip(join(embeddedPostgresPath, "native.txz"), embeddedPostgresPath)
        await extractZip(join(embeddedPostgresPath, "native.tar"), embeddedPostgresPath)
        removeSync(join(embeddedPostgresPath, "native.txz"))
        removeSync(join(embeddedPostgresPath, "native.tar"))
    } catch (error) {
        throw error
    }
}

export {
    isPostgresInstalled,
    getPostgresBinaries,
    PostgresBinaries
} from "./utils.js"

export {
    installPostgres
}