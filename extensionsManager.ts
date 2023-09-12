// @ts-ignore
import { remote } from 'electron';
import fs from "fs";
import * as yauzl from "yauzl";
import * as path from "path";

export class ExtensionsManager {
	constructor() {}

	async loadExtension(extensionPath: string) {
		try {
			const extension = await remote.BrowserWindow.getFocusedWindow().webContents.session.loadExtension(extensionPath);
			console.log(`Extension ${extension.name} loaded successfully.`);
		} catch (error) {
			console.error('Failed to load extension:', error);
		}
	}

  async loadCrxExtension(crxPath: string) {
    try {
      const tempDir = './tempExtension';

      const zipData = await this.removeCrxSignature(crxPath);

      yauzl.fromBuffer(zipData, {lazyEntries: true}, (err, zipfile) => {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", (entry) => {
          const filePath = path.join(tempDir, entry.fileName);
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err;
            fs.mkdirSync(path.dirname(filePath), {recursive: true});
            readStream.pipe(fs.createWriteStream(filePath));
            readStream.on("end", () => {
              zipfile.readEntry();
            });
          });
        });
        zipfile.on("end", async () => {
          await this.loadExtension(tempDir);
          // Supprimer le dossier temporaire après avoir chargé l'extension
          fs.rmdirSync(tempDir, { recursive: true });
        });
      });
    } catch (error) {
      console.error('Failed to load .crx extension:', error);
    }
  }


  removeCrxSignature(crxPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(crxPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const zipData = data.slice(16); // Supprime les 16 premiers octets (signature .crx)
          resolve(zipData);
        }
      });
    });
  }

  // async loadCrxExtension(crxPath: string) {
  //   try {
  //     const zip = new AdmZip(crxPath);
  //     const tempDir = './tempExtension';
  //     zip.extractAllTo(tempDir, true);
  //
  //     await this.loadExtension(tempDir);
  //
  //     // Supprimer le dossier temporaire après avoir chargé l'extension
  //     fs.rmdirSync(tempDir, { recursive: true });
  //   } catch (error) {
  //     console.error('Failed to load .crx extension:', error);
  //   }
  // }
}
