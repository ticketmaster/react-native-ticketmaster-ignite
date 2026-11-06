#import "RCTNativeRetailSdk.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>
#import "TMIgniteSwiftFactory.h"

@implementation RCTNativeRetailSdk {
  id<TMIgniteRetailSDK> retailSDK;
}


- (instancetype)init {
  if (self = [super init]) {
    retailSDK = [TMIgniteSwiftFactory makeRetailSDK];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeRetailSdkSpecJSI>(params);
}

- (void)presentPrePurchaseAttraction:(NSString *)attractionId
{
  [retailSDK presentPrePurchaseAttractionWithAttractionId:attractionId];
}

- (void)presentPrePurchaseVenue:(NSString *)venueId
{
  [retailSDK presentPrePurchaseVenueWithVenueId:venueId];
}

- (void)presentPurchase:(NSString *)eventId
{
  [retailSDK presentPurchaseWithEventId:eventId];
}

+ (NSString *)moduleName
{
  return @"NativeRetailSdk";
}

@end
