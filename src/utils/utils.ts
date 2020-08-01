export function readSingleFile(file: Blob): Promise<string> {
    return new Promise((resolve) => {
        var reader = new FileReader();

        reader.onload = function(e) {
            resolve(e.target!.result as string);
          };
          reader.readAsText(file);
    })
    
  }