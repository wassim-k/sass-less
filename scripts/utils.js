const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

function processFiles(folderpath, processFile, processFolder, level = 0) {
    if (fs.existsSync(folderpath)) {
        fs.readdirSync(folderpath).forEach(file => {
            const currentPath = path.join(folderpath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                if (processFiles(currentPath, processFile, processFolder, level + 1)) {
                    processFolder(currentPath);
                }
            } else {
                processFile(currentPath, level);
            }
        });
        return true;
    } else {
        return false;
    }
}

function deleteFolderRecursive(folder) {
    if (processFiles(folder, filepath => fs.unlinkSync(filepath), folderpath => fs.rmdirSync(folderpath))) {
        fs.rmdirSync(folder);
    }
};

Object.assign(exports, {
    processFiles,
    copyRecursiveSync,
    deleteFolderRecursive
});
