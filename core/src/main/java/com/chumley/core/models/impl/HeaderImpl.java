package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Navigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.experimental.Delegate;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {Navigation.class,
  ComponentExporter.class}, resourceType = HeaderImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = HeaderImpl.class)
public class HeaderImpl extends AbstractComponentImpl implements ComponentExporter, Navigation {
  public static final String RESOURCE_TYPE = "chumley/components/header";
  @ValueMapValue
  @Default(values = "Chumley")
  @Getter
  private String applicationName;
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DelegationExclusion.class)
  private Navigation delegate;
  @ValueMapValue
  @Default(values = "/content/chumley/us/en/home")
  private String homePage;
  @Getter
  private List<NavigationItem> navigationItems;
  @ScriptVariable
  private ResourceResolver resolver;

  public String getHomePage() {
    String homePageWithExtension = homePage;
    @Nullable Resource homePageResource = resolver.getResource(homePage);
    if (null != homePageResource) {
      @Nullable Page page = homePageResource.adaptTo(Page.class);
      if (null != page) {
        homePageWithExtension = homePage + ".html";
      }
    }
    return homePageWithExtension;
  }

  @Override
  public @NotNull String getExportedType() {
    return RESOURCE_TYPE;
  }

  @Override
  public List<NavigationItem> getItems() {
    return null;
  }

  @PostConstruct
  public void activate() {
    navigationItems = delegate.getItems();
  }

  private interface DelegationExclusion {
    String getExportedType();

    List<NavigationItem> getItems();
  }
}
