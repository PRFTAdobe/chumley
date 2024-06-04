import { AuthoringUtils, ModelClient } from '@adobe/aem-spa-page-model-manager';

export default class CoreModelClient extends ModelClient {
  private authorizationHeader?: string;

  constructor(apiHost?: string, authorizationHeader?: string) {
    super(apiHost);
    if (authorizationHeader) {
      this.authorizationHeader = authorizationHeader;
    }
  }

  fetch(modelPath: string) {
    if (!modelPath) {
      const err = `Fetching model rejected for path: ${modelPath}`;

      return Promise.reject(new Error(err));
    }

    // Either the API host has been provided or we make an absolute request relative to the current host
    const apihostPrefix = this.apiHost ?? '';
    let url = `${apihostPrefix}${modelPath}`;
    if (!AuthoringUtils.isInEditor()) {
      url = `${url}?wcmmode=disabled`;
    }

    const requestInit: RequestInit = {
      credentials: 'same-origin',
    };

    if (this.authorizationHeader) {
      requestInit.headers = {
        Authorization: this.authorizationHeader,
      };
    }

    return fetch(url, requestInit)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }

        return Promise.reject(response);
      })
      .catch((error) => Promise.reject(error));
  }
}
