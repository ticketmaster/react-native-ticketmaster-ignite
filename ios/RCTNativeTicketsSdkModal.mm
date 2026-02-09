#import "RCTNativeTicketsSdkModal.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@implementation RCTNativeTicketsSdkModal {
  TicketsSdkModal *ticketsSdkModal;
}

- (instancetype)init {
  if (self = [super init]) {
    ticketsSdkModal = [TicketsSdkModal new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeTicketsSdkModalSpecJSI>(params);
}

- (void)showTicketsSdkModal
{
  [ticketsSdkModal showTicketsSdkModal];
}

+ (NSString *)moduleName
{
  return @"NativeTicketsSdkModal";
}

@end
