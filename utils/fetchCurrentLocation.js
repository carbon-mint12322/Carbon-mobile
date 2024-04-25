import Geolocation from "@react-native-community/geolocation";

const NO_OF_RETRY = 10

export async function fetchCurrentLocation(params = {}) {
    console.log(params, 'fetch loc called..')
    for(let i = 0; i < (params.numberOfTries || NO_OF_RETRY); i++) {
      console.log(' Looping for the : ', i, 'with condition ', `${i} < ${params.numberOfTries || NO_OF_RETRY} = `, i < params.numberOfTries || NO_OF_RETRY, 'with type ', typeof params.numberOfTries || NO_OF_RETRY)
      try {
        const data = await (new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            (position) => {
              const { accuracy } = position.coords;
              console.log(accuracy, ' ,=== acc in parent')
              if (accuracy <= 25 || i === (params.numberOfTries || NO_OF_RETRY) - 1) {
                  return resolve(position)
              } else {
                  return reject(new Error('Not accurate'))
                  // return fetchC urrentLocation();
              }
            },
            (error) => {
              if (false && error.message === "Location request timed out") {
                Geolocation.getCurrentPosition(
                  (position) => {
                    const { accuracy } = position.coords;
                    console.log(accuracy, ' ,=== acc in child')
                    if (accuracy <= 25 || NO_OF_RETRY - 1) {
                      return resolve(position)
                    } else {
                      // return fetchCurrentLocation();
                    }
                  },
                  (error) => {
                      if(i === NO_OF_RETRY - 1) {
                          return reject({ message: `${error.message} from child`, time: new Date() })
                      }
                  },
                  {
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 1000,
                    distanceFilter: 10,
                  }
                );
              } else {
                  // if(i === (params.numberOfTries || NO_OF_RETRY) - 1) {
                  // }
              }
                return Promise.reject({ message: `${error.message} from parent`, time: new Date() })
            },
            {
              enableHighAccuracy: true,
              timeout: 1000,
              maximumAge: 1000,
              distanceFilter: 10,
              ...params
            }
          );
        }))
        return data;
      } catch(error) {
        console.log(error, ' <=== Error..')
        continue;
      }
    }
    return Promise,reject(new Error('Unable to fetch users location'))
  }