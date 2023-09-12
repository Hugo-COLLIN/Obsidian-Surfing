// @ts-ignore
import { remote } from 'electron';

import { createReadStream } from 'fs';
import * as unzipper from 'unzipper';


export class ExtensionsManager {
	constructor() {}

  // pipelineAsync = promisify(pipeline);

  async loadExtension(extensionPath: string) {
		try {
			const extension = await remote.BrowserWindow.getFocusedWindow().webContents.session.loadExtension(extensionPath);
			console.log(`Extension ${extension.name} loaded successfully.`);
		} catch (error) {
			console.error('Failed to load extension:', error);
		}
	}

  async loadCrxExtension(crxPath: string) {
    // Specify the output directory for extracted files
    //TODO: create a temp directory
    const outputDir = crxPath.split('.crx')[0];

    try {
      // Create a readable stream from the .crx file
      const readable = createReadStream(crxPath);

      // Extract the .crx file to the output directory
      await readable.pipe(unzipper.Extract({ path: outputDir }));

      // Load the extension from the output directory
      await this.loadExtension(outputDir);
    } catch (error) {
      console.error('Failed to load crx extension:', error);
    }
  }

  // async loadCrxExtension(crxPath: string) {
  //   try {
  //     const tempDir = './tempExtension';
  //
  //     // Load the CRX file into memory
  //     const crxBuffer = await promisify(fs.readFile)(crxPath);
  //
  //     // Extract the extension ID from the CRX file
  //     const { id } = await load(crxBuffer);
  //
  //     // Rename the CRX file to ZIP
  //     const zipPath = `${crxPath.slice(0, -4)}.zip`;
  //     await promisify(fs.rename)(crxPath, zipPath);
  //
  //     // Extract ZIP contents to the temporary directory
  //     await this.pipelineAsync(
  //       createReadStream(zipPath),
  //       Extract({ path: tempDir })
  //     );
  //
  //     // Load the extension from the temporary directory
  //     await this.loadExtension(tempDir);
  //
  //     // Remove the temporary directory after loading the extension
  //     fs.rmdirSync(tempDir, { recursive: true });
  //
  //     // Rename the ZIP file back to CRX
  //     const crxPathNew = `${tempDir}/${id}.crx`;
  //     await promisify(fs.rename)(zipPath, crxPathNew);
  //   } catch (error) {
  //     console.error('Failed to load .crx extension:', error);
  //   }
  // }



  // async loadCrxExtension(crxPath: string) {
  //   try {
  //     const zipPath = `${crxPath}.zip`;
  //     const tempDir = './tempExtension';
  //
  //     // Convert CRX to ZIP
  //     await crx3.toZIP(crxPath, zipPath);
  //
  //     // Extract ZIP contents to the temporary directory
  //     await this.pipelineAsync(
  //       createReadStream(zipPath),
  //       Extract({ path: tempDir })
  //     );
  //
  //     await this.loadExtension(tempDir);
  //
  //     // Remove the temporary directory after loading the extension
  //     fs.rmdirSync(tempDir, { recursive: true });
  //   } catch (error) {
  //     console.error('Failed to load .crx extension:', error);
  //   }
  // }



  // async loadCrxExtension(crxPath: string) {
  //     try {
  //       const zip = new AdmZip(crxPath);
  //       const tempDir = './tempExtension';
  //       unzip(crxPath).then(() => {
  //         console.log("Successfully unzipped your crx file..");
  //       });
  //
  //       await this.loadExtension(tempDir);
  //
  //       // Supprimer le dossier temporaire après avoir chargé l'extension
  //       fs.rmdirSync(tempDir, { recursive: true });
  //     } catch (error) {
  //       console.error('Failed to load .crx extension:', error);
  //     }
  //   }



  // async loadCrxExtension(crxPath: string) {
  //   try {
  //     const tempDir = './tempExtension';
  //
  //     // const zipData = await this.removeCrxSignature(crxPath);
  //
  //     fs.createReadStream(crxPath)
  //       .pipe(unzipper.Extract({ path: tempDir }))
  //       .on('close', async () => {
  //         await this.loadExtension(tempDir);
  //         // Supprimer le dossier temporaire après avoir chargé l'extension
  //         fs.rmdirSync(tempDir, { recursive: true });
  //       });
  //   } catch (error) {
  //     console.error('Failed to load .crx extension:', error);
  //   }
  // }


  // async loadCrxExtension(crxPath: string) {
  //   try {
  //     const tempDir = './tempExtension';
  //
  //     const zipData = await this.removeCrxSignature(crxPath);
  //
  //     yauzl.fromBuffer(zipData, {lazyEntries: true}, (err, zipfile) => {
  //       if (err) throw err;
  //       zipfile.readEntry();
  //       zipfile.on("entry", (entry) => {
  //         const filePath = path.join(tempDir, entry.fileName);
  //         zipfile.openReadStream(entry, (err, readStream) => {
  //           if (err) throw err;
  //           fs.mkdirSync(path.dirname(filePath), {recursive: true});
  //           readStream.pipe(fs.createWriteStream(filePath));
  //           readStream.on("end", () => {
  //             zipfile.readEntry();
  //           });
  //         });
  //       });
  //       zipfile.on("end", async () => {
  //         await this.loadExtension(tempDir);
  //         // Supprimer le dossier temporaire après avoir chargé l'extension
  //         fs.rmdirSync(tempDir, { recursive: true });
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Failed to load .crx extension:', error);
  //   }
  // }


  // removeCrxSignature(crxPath: string): Promise<Buffer> {
  //   return new Promise((resolve, reject) => {
  //     fs.readFile(crxPath, (err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const zipData = data.slice(16); // Supprime les 16 premiers octets (signature .crx)
  //         resolve(zipData);
  //       }
  //     });
  //   });
  // }

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
