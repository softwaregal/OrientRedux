/**
 * @class       : helpSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 09, 2019 13:15:28 IST
 * @description : helpSelector
 */

export const getGiftingList = state => {
  try {
    return state.gifting.giftingData.Response.UserId.map(entry => entry.UserId);
  } catch (err) {
    return [];
  }
}
