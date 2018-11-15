/**
 *
 * @param {Response} data
 * @param {object} data.regeocode
 * @param {array} data.regeocode.pois
 */
const addressVO = (data) => {
  return data.regeocode.pois;
};


/**
 *
 * @param loc
 * @returns {Promise}
 */
export const reGeo = (loc) => (
  new Promise((resolve, reject) => {
    // const key = process.env.REACT_APP_AMAP_KEY;

    const key = 'b068eea7c41a9d8aa07fcd9244285d9c';

    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${loc}&extensions=all`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.infocode === '10000') {
          resolve(addressVO(json));
        } else {
          reject(json)
        }
      })
      .catch(e => reject(e))
  })
);

const searchDTO = (dto) => {

  return dto.map(v => ({
    id: v.id,
    name: v.name,
    location: v.location,
    distance: 0,
    address: v.address,
  }))

};

export const search = (kw) => (
  new Promise((resolve, reject) => {
    const key = 'b068eea7c41a9d8aa07fcd9244285d9c';

    fetch(`https://restapi.amap.com/v3/place/text?key=${key}&keywords=${kw}&city=wuhan&citylimit=true&output=JSON`)
      .then(res => res.json())
      .then(json => {
        if (json.infocode === '10000') {
          return resolve(json.pois);
        } else {
          return reject();
        }
      })
      .catch(e => reject(e))
  }).then(data => searchDTO(data))
);
