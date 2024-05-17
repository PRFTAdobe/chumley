import { ModelClient } from '@adobe/aem-spa-page-model-manager';

export default class LocalDevModelClient extends ModelClient {
  private authorizationHeader: string;

  constructor(apiHost: string, authorizationHeader: string) {
    super(apiHost);
    this.authorizationHeader = authorizationHeader;
  }

  fetch(modelPath: string) {
    if (!modelPath) {
      const err = `Fetching model rejected for path: ${modelPath}`;

      return Promise.reject(new Error(err));
    }

    // Either the API host has been provided or we make an absolute request relative to the current host
    const apihostPrefix = this.apiHost ?? '';
    const url = `${apihostPrefix}${modelPath}`;

    return fetch(url, {
      credentials: 'same-origin',
      headers: {
        Authorization: this.authorizationHeader,
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }

        return Promise.reject(response);
      })
      .catch((error) => Promise.reject(error));
  }
}
