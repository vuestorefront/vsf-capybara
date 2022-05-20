interface UploaderData {
  uid: number,
  allowMultiple: boolean,
  hasUploadedFiles: boolean
};

interface ArtworkUploadStoreState {
  activeUploaders: UploaderData[]
};

export const artworkUploadStore = {
  state: {
    activeUploaders: [] as UploaderData[]
  },
  mutations: {
    registerUploader (state: ArtworkUploadStoreState, uploaderData: UploaderData) {
      state.activeUploaders.push(uploaderData);
    },
    updateUploaderData (
      state: ArtworkUploadStoreState,
      { uid, dataForUpdate }: { uid: number, dataForUpdate: Partial<UploaderData> }
    ) {
      const index = state.activeUploaders.findIndex((uploaderData) => uid === uploaderData.uid);

      if (index < 0) {
        return;
      }

      const uploader = { ...state.activeUploaders[index], ...dataForUpdate };
      state.activeUploaders.splice(index, 1, uploader);
    },
    unregisterUploader (state: ArtworkUploadStoreState, uploaderUid: number) {
      const index = state.activeUploaders.findIndex(({ uid }) => uid === uploaderUid);

      if (index < 0) {
        return;
      }

      state.activeUploaders.splice(index, 1);
    }
  },
  getters: {
    firstAvailablePageDropUploaderUid (state: ArtworkUploadStoreState): number | undefined {
      const uploader = state.activeUploaders.find((uploaderData) => {
        return uploaderData.allowMultiple || !uploaderData.hasUploadedFiles;
      })

      return uploader?.uid;
    }
  }
}
