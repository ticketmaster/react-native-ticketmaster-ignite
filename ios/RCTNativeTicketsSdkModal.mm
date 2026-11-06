#import "RCTNativeTicketsSdkModal.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>
#import "TMIgniteSwiftFactory.h"

@implementation RCTNativeTicketsSdkModal {
  id<TMIgniteTicketsSDKModal> ticketsSDKModal;
}

- (instancetype)init {
  if (self = [super init]) {
    ticketsSDKModal = [TMIgniteSwiftFactory makeTicketsSDKModal];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeTicketsSdkModalSpecJSI>(params);
}

- (void)showTicketsSdkModal:(NSString *)deepLinkId
{
  [ticketsSDKModal showTicketsSdkModal:deepLinkId];
}

+ (NSString *)moduleName
{
  return @"NativeTicketsSdkModal";
}

@end
