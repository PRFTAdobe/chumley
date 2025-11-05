import {
  AccordionV1,
  AccordionV1IsEmptyFn,
  AccordionV1Properties,
  CarouselV1,
  CarouselV1IsEmptyFn,
  CarouselV1Properties,
  ContainerV1IsEmptyFn,
  ContainerV1Properties,
  ContentFragmentV1IsEmptyFn,
  TabsV1,
  TabsV1IsEmptyFn,
  TabsV1Properties,
} from '@adobe/aem-core-components-react-spa';
import {
  ContentFragmentV1,
  ContentFragmentV1Properties,
  MapToContentFragmentModel,
} from '@adobe/aem-core-components-react-spa/dist/container/contentfragment/v1';
import {
  EditConfig,
  MappedComponentProperties,
  MapTo,
  withComponentMappingContext,
} from '@adobe/aem-react-editable-components';
import {
  BreadCrumbEditConfig,
  ButtonEditConfig,
  CoreBreadCrumb,
  CoreDownload,
  CoreEmbed,
  CoreLanguageNavigation,
  CoreList,
  CoreNavigation,
  CoreSeparator,
  CoreTeaser,
  CoreText,
  DownloadEditConfig,
  EmbedEditConfig,
  ImageEditConfig,
  LanguageNavigationEditConfig,
  ListEditConfig,
  NavigationEditConfig,
  NavigationItem,
  TeaserEditConfig,
  TextEditConfig,
  TitleEditConfig,
} from 'aem-react-core-wcm-components-base';
import { ComponentType } from 'react';
import ChumleyButton from '@/components/ChumleyButton';
import ChumleyContactForm from '@/components/ChumleyContactForm';
import ChumleyContainer from '@/components/ChumleyContainer';
import ChumleyContentFragment from '@/components/ChumleyContentFragment';
import ChumleyHeader from '@/components/ChumleyHeader';
import ChumleyImage from '@/components/ChumleyImage';
import ChumleyTitle from '@/components/ChumleyTitle';
import CoreExperienceFragment from '@/components/CoreExperienceFragment';
import CorePage from '@/components/CorePage';

MapTo('chumley/components/breadcrumb')(
  CoreBreadCrumb as unknown as ComponentType<MappedComponentProperties>,
  BreadCrumbEditConfig,
);

MapTo('chumley/components/button')(ChumleyButton, ButtonEditConfig);

MapTo('chumley/components/download')(
  CoreDownload as unknown as ComponentType<MappedComponentProperties>,
  DownloadEditConfig,
);

MapTo('chumley/components/embed')(
  CoreEmbed as unknown as ComponentType<MappedComponentProperties>,
  EmbedEditConfig,
);

MapTo('chumley/components/image')(
  ChumleyImage as unknown as ComponentType<MappedComponentProperties>,
  ImageEditConfig,
);

MapTo('chumley/components/languagenavigation')(
  CoreLanguageNavigation as unknown as ComponentType<MappedComponentProperties>,
  LanguageNavigationEditConfig,
);

MapTo('chumley/components/list')(
  CoreList as unknown as ComponentType<MappedComponentProperties>,
  ListEditConfig,
);

MapTo('chumley/components/navigation')(
  CoreNavigation as unknown as ComponentType<MappedComponentProperties>,
  NavigationEditConfig,
);

MapTo('chumley/components/separator')(CoreSeparator);

MapTo('chumley/components/teaser')(
  CoreTeaser as unknown as ComponentType<MappedComponentProperties>,
  TeaserEditConfig,
);

MapTo('chumley/components/text')(
  CoreText as unknown as ComponentType<MappedComponentProperties>,
  TextEditConfig,
);

MapTo('chumley/components/title')(
  ChumleyTitle as unknown as ComponentType<MappedComponentProperties>,
  TitleEditConfig,
);

MapTo('chumley/components/accordion')(
  AccordionV1 as unknown as ComponentType<MappedComponentProperties>,
  {
    emptyLabel: 'Accordion',
    isEmpty(props) {
      return AccordionV1IsEmptyFn(props as AccordionV1Properties);
    },
  },
);
MapTo('chumley/components/carousel')(
  CarouselV1 as unknown as ComponentType<MappedComponentProperties>,
  {
    emptyLabel: 'Carousel',
    isEmpty(props) {
      return CarouselV1IsEmptyFn(props as CarouselV1Properties);
    },
  },
);
MapTo('chumley/components/container')(
  ChumleyContainer as unknown as ComponentType<MappedComponentProperties>,
  {
    emptyLabel: 'Container',
    isEmpty(props) {
      return ContainerV1IsEmptyFn(props as ContainerV1Properties);
    },
  },
);

MapTo('chumley/components/tabs')(
  TabsV1 as unknown as ComponentType<MappedComponentProperties>,
  {
    emptyLabel: 'Tabs',
    isEmpty(props) {
      return TabsV1IsEmptyFn(props as TabsV1Properties);
    },
  },
);

MapTo('chumley/components/page')(
  withComponentMappingContext(
    CorePage,
  ) as unknown as ComponentType<MappedComponentProperties>,
);

interface ExperienceFragmentProperties extends MappedComponentProperties {
  configured: boolean;
}

const ExperienceFragmentConfig: EditConfig<ExperienceFragmentProperties> = {
  emptyLabel: 'Experience Fragment',

  isEmpty(props?: { configured: boolean }) {
    return !props?.configured;
  },
};

MapTo('chumley/components/experiencefragment')(
  withComponentMappingContext(
    CoreExperienceFragment,
  ) as unknown as ComponentType<MappedComponentProperties>,
  ExperienceFragmentConfig,
);

interface HeaderProperties extends MappedComponentProperties {
  navigationItems?: NavigationItem[];
}

const HeaderConfig: EditConfig<HeaderProperties> = {
  emptyLabel: 'Header',
  isEmpty(props: { navigationItems?: NavigationItem[] }) {
    return (
      props.navigationItems === null || props.navigationItems?.length === 0
    );
  },
};

MapTo('chumley/components/header')(
  ChumleyHeader as unknown as ComponentType<MappedComponentProperties>,
  HeaderConfig,
);
MapTo('chumley/components/contact-form')(ChumleyContactForm);
MapTo('chumley/components/contentfragment')(
  ContentFragmentV1 as unknown as ComponentType<MappedComponentProperties>,
  {
    emptyLabel: 'Content Fragment',
    isEmpty(props) {
      return ContentFragmentV1IsEmptyFn(props as ContentFragmentV1Properties);
    },
  },
);

MapToContentFragmentModel('chumley/models/about')(ChumleyContentFragment);
