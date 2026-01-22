#import "RCTTicketsSdkModalView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/ComponentDescriptors.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/EventEmitters.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/Props.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/RCTComponentViewHelpers.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
// For static libraries
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCTTicketsSdkModalView () <RCTTicketsSdkModalViewViewProtocol>
@end

@implementation RCTTicketsSdkModalView {
  TicketsSdkModalView *_view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<TicketsSdkModalViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const TicketsSdkModalViewProps>();
    _props = defaultProps;

    _view = [[TicketsSdkModalView alloc] init];
    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<TicketsSdkModalViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<TicketsSdkModalViewProps const>(props);

  // No custom props to handle - modal is self-contained

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> TicketsSdkModalViewCls(void)
{
  return RCTTicketsSdkModalView.class;
}

@end
