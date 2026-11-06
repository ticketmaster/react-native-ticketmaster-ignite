#import "RCTTicketsSdkEmbeddedView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/ComponentDescriptors.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/EventEmitters.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/Props.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/RCTComponentViewHelpers.h>
#import "TMIgniteSwiftFactory.h"

#import <React/RCTFabricComponentsPlugins.h>

using namespace facebook::react;

@interface RCTTicketsSdkEmbeddedView () <RCTTicketsSdkEmbeddedViewViewProtocol>
@end

@implementation RCTTicketsSdkEmbeddedView {
  UIView<TMIgniteTicketsEmbeddedView> *_view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<TicketsSdkEmbeddedViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const TicketsSdkEmbeddedViewProps>();
    _props = defaultProps;

    _view = [TMIgniteSwiftFactory makeTicketsEmbeddedView];
    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<TicketsSdkEmbeddedViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<TicketsSdkEmbeddedViewProps const>(props);

  // offsetTop is Android-only, no-op on iOS
  // Property is handled by codegen but not used in iOS implementation

  if (oldViewProps.deepLinkId != newViewProps.deepLinkId) {
    NSString *deepLinkId = newViewProps.deepLinkId.empty() ? nil : [NSString stringWithUTF8String:newViewProps.deepLinkId.c_str()];
    [_view setDeepLinkId:deepLinkId];
  }

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> TicketsSdkEmbeddedViewCls(void)
{
  return RCTTicketsSdkEmbeddedView.class;
}

@end
