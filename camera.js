/**
 * @class       : camera
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 28, 2019 16:55:31 IST
 * @description : camera
 */

import ImagePicker from 'react-native-image-picker';

// mode = 'camera, gallery, both',
export const selectPicture = ({
  title,
  onSelect,
  showRemove,
  onError,
  mode,
}) => {
  const options = {
    title: title || 'Select a picture',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Camera',
    customButtons: showRemove ? [{ name: 'remove', title: 'Remove' }] : [],
    chooseFromLibraryButtonTitle: 'Gallery',
    mediaType: 'photo',
    allowsEditing: false,
    storageOptions: { },
    resizeMethod: 'resize',
    quality: 0.3,
  };

  let pickerMethod = null;
  if (mode === 'camera') {
    pickerMethod = ImagePicker.launchCamera;
  } else if (mode === 'gallery') {
    pickerMethod = ImagePicker.launchImageLibrary;
  } else {
    pickerMethod = ImagePicker.showImagePicker;
  }

  pickerMethod(options, (response) => {
    if (response.didCancel) {
      return;
    } else if (response.error) {
      if (onError) {
        onError(response.error);
      }
    } else if (response.customButton) {
      if (response.customButton === 'remove' && onSelect) {
        if (onSelect) {
          onSelect(null);
        }
      }
    } else {
      if (onSelect) {
        const { uri, data, type } = response;
        onSelect({ uri, data, type });
      }
    }
  });
}

export const toBase64String = picture => picture.data;
