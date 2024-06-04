import {
  AuthoringUtils,
  Model,
  ModelManager,
} from '@adobe/aem-spa-page-model-manager';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  MemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ComponentMapping,
  Constants,
  Utils,
} from '@adobe/aem-react-editable-components';
import CoreModelClient from '@/config/CoreModelClient';
import { createDynamicPageRoutes, createPageRoutes } from '@/routes';
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
  modelClient?: CoreModelClient;
} = {};

let containerId = 'spa-root';
let isInEditor = false;

if (typeof window.environment !== 'undefined') {
  modelManagerOptions.modelClient = new CoreModelClient(
    'http://localhost:4502',
    'Basic YWRtaW46YWRtaW4:',
  );
  containerId = 'root';
} else {
  modelManagerOptions.modelClient = new CoreModelClient();
  isInEditor = AuthoringUtils.isInEditor();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById(containerId);
  const root = createRoot(container!);
  const pageModel = await ModelManager.initialize(modelManagerOptions);
  const queryFunction = async (cqPath: string) => {
    const response = await fetch(`${cqPath}.model.json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return (await response.json()) as Model;
  };

  const loader = (key: string) =>
    queryClient.fetchQuery({
      queryFn: () => queryFunction(key),
      queryKey: [key],
    });

  let definedRoutes = [];
  if (AuthoringUtils.isInEditor()) {
    definedRoutes = createPageRoutes(
      pageModel[Constants.CHILDREN_PROP]!,
      ComponentMapping,
    );
  } else {
    definedRoutes = createDynamicPageRoutes(
      pageModel[Constants.CHILDREN_PROP]!,
      loader,
    );
  }

  root.render(
    definedRoutes.length > 0 ? (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createBrowserRouter(definedRoutes)} />
      </QueryClientProvider>
    ) : (
      <MemoryRouter>
        <App {...Utils.modelToProps(pageModel)} isInEditor={isInEditor} />
      </MemoryRouter>
    ),
  );
});
