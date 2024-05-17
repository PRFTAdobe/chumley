package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.LayoutContainer;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.foundation.model.export.AllowedComponentsExporter;
import com.day.cq.wcm.foundation.model.responsivegrid.ResponsiveGrid;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;

import javax.annotation.PostConstruct;
import java.util.Map;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {LayoutContainer.class, ContainerExporter.class,
  ComponentExporter.class}, resourceType = LayoutContainerImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = LayoutContainerImpl.class)
public class LayoutContainerImpl extends AbstractComponentImpl
  implements LayoutContainer, ContainerExporter, ComponentExporter {
  public static final String CQ_STYLE_DEFAULT_ELEMENT = "cq:styleDefaultElement";
  public static final String RESOURCE_TYPE = "chumley/components/container";
  @Getter
  @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
  @Default(booleanValues = false)
  private boolean addGapBetweenComponents;

  @Getter
  @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
  @Default(values = "0x")
  private String blockPadding;
  @ScriptVariable
  private Style currentStyle;
  private String exportedType;
  @Self
  @Via(type = ResourceSuperType.class)
  private LayoutContainer layoutContainer;
  @Self
  @Via(type = ResourceSuperType.class)
  private ResponsiveGrid responsiveGrid;
  @Getter
  private String styleSystemElement;

  public String getBackgroundColor() {
    String backgroundColor = null;
    if (null != currentStyle) {
      Boolean backgroundColorEnabled = currentStyle.get(PN_BACKGROUND_COLOR_ENABLED, Boolean.FALSE);
      if (Boolean.TRUE.equals(backgroundColorEnabled)) {
        backgroundColor = resource.getValueMap().get(PN_BACKGROUND_COLOR, String.class);
      }
    }
    return backgroundColor;
  }

  @Override
  public String getBackgroundStyle() {
    return layoutContainer.getBackgroundStyle();
  }

  @Override
  public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
    return responsiveGrid.getExportedItems();
  }

  @Override
  public String @NotNull [] getExportedItemsOrder() {
    return responsiveGrid.getExportedItemsOrder();
  }

  public Map<String, String> getColumnClassNames() {
    return responsiveGrid.getColumnClassNames();
  }

  public int getColumnCount() {
    return responsiveGrid.getColumnCount();
  }

  @JsonProperty("allowedComponents")
  public AllowedComponentsExporter getExportedAllowedComponents() {
    return responsiveGrid.getExportedAllowedComponents();
  }

  @Override
  public @NotNull String getExportedType() {
    return exportedType;
  }

  public String getGridClassNames() {
    return responsiveGrid.getGridClassNames();
  }

  @Override
  public @NotNull LayoutType getLayout() {
    return layoutContainer.getLayout();
  }

  @Override
  public String getRoleAttribute() {
    return layoutContainer.getRoleAttribute();
  }

  @PostConstruct
  public void activate() {
    exportedType = RESOURCE_TYPE;
    styleSystemElement = currentStyle.get(CQ_STYLE_DEFAULT_ELEMENT, "div");
  }
}
