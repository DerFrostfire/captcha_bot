const STORAGE_PATH =
    Meteor.absolutePath + '/.utils/storageItems'

StorageItems = new FilesCollection({
    collectionName: 'storageItems',
    allowClientCode: true,
    onBeforeUpload(file) {
        return true
        // if (/mp3|mp4/i.test(file.extension)) {
        // 	return true
        // }
        // return 'Please upload mp3 audio'
    },
    storagePath: () => (Meteor.isDevelopment ? STORAGE_PATH : '/.utils/storageItems'),
})
