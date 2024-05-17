import {
  AuthoringUtils,
  ModelManager,
} from '@adobe/aem-spa-page-model-manager';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  MemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  ComponentMapping,
  Constants,
  Utils,
} from '@adobe/aem-react-editable-components';
import LocalDevModelClient from '@/config/LocalDevModelClient';
import createPageRoutes from '@/routes';
import App from '@/App';
import 'aem-react-core-wcm-components-base/dist/aem-react-core-wcm-components-base.css';
import './components/CoreSpa.css';
import './index.css';

declare global {
  interface Window {
    environment: string;
  }
}

const modelManagerOptions: {
  errorPageRoot?: string;
  modelClient?: LocalDevModelClient;
} = {};

let containerId = 'spa-root';
let isInEditor = false;

if (typeof window.environment !== 'undefined') {
  modelManagerOptions.modelClient = new LocalDevModelClient(
    'http://localhost:4502',
    'Basic YWRtaW46YWRtaW4:',
  );
  containerId = 'root';
} else {
  isInEditor = AuthoringUtils.isInEditor();
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById(containerId);
  const root = createRoot(container!);
  const pageModel = await ModelManager.initialize(modelManagerOptions);
  const definedRoutes = createPageRoutes(
    pageModel[Constants.CHILDREN_PROP]!,
    ComponentMapping,
  );

  root.render(
    definedRoutes.length > 0 ? (
      <RouterProvider router={createBrowserRouter(definedRoutes)} />
    ) : (
      <MemoryRouter>
        <App {...Utils.modelToProps(pageModel)} isInEditor={isInEditor} />
      </MemoryRouter>
    ),
  );
});
