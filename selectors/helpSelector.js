/**
 * @class       : helpSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 09, 2019 13:15:28 IST
 * @description : helpSelector
 */

export const getContactUsList = state => {
  try {
    console.log("I am here in contact list");
    return state.help.contactUs.Response.PhoneNo.map(entry => entry.PhoneNo);
  } catch (err) {
    console.log("I am here in contact list11111111111s " + err);
    return [];
  }
}

export const getContactUsHtml = state => {
  try {
    return state.help.contactUs.HTMLContent;
  } catch (err) {
    return null;
  }
}

export const getAboutUsHtml = state => {
  try {
    return state.help.aboutUs.HTMLContent;
  } catch (err) {
    return null;
  }
}

export const getAboutUsImageList = state => {
  try {
    return state.help.aboutUs.Response.Image.map(image => image.Images);
  } catch (err) {
    return [];
  }
}

export const getAppVersion = state => state.help.appversion;
