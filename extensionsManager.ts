// @ts-ignore
import { remote } from 'electron';
import fs from "fs";
import AdmZip from 'adm-zip';

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
      const zip = new AdmZip(crxPath);
      const tempDir = './tempExtension';
      zip.extractAllTo(tempDir, true);

      await this.loadExtension(tempDir);

      // Supprimer le dossier temporaire après avoir chargé l'extension
      fs.rmdirSync(tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to load .crx extension:', error);
    }
  }
}
