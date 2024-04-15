
export const downloadAndReplaceFile = async (TSS_IP, fileName, targetDirectory) => {
    if (TSS_IP === "None") {
      console.error("TSS_IP is not set.");
      return;
    }
}
    /*
  
    try {
        const response = await fetch(`http://${TSS_IP}${fileName}`, {
          method: 'GET',
          mode: 'no-cors' // Set mode to 'no-cors'
        });
        
      
        // Ensure the response is ok
        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
        }
      
        // Convert the response to a blob
        const blob = await response.blob();
      
        // Open or create an IndexedDB database
        const db = await window.indexedDB.open('file_storage', 1);
        const storeName = 'files';
      
        // Create a transaction and get the object store
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
      
        // Clear the existing file (assuming 'fileName' is the key)
        store.delete(fileName);
      
        // Store the downloaded file in IndexedDB
        store.put(blob, fileName);
      
        console.log(`File '${fileName}' downloaded and stored in IndexedDB.`);
      } catch (error) {
        console.error('Error downloading and storing file:', error);
      }
    }      
*/