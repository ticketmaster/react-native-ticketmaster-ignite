#import "RCTNativeRetailSdk.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>


#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
// For static libraries
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@implementation RCTNativeRetailSdk {
  RetailSDK *retailSDK;
}


- (instancetype)init {
  if (self = [super init]) {
    retailSDK = [RetailSDK new];
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
