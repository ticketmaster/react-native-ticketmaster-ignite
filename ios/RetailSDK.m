#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RetailSDK, NSObject)


- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXTERN_METHOD(presentPrePurchaseVenue:(NSString *)venueId)

RCT_EXTERN_METHOD(presentPrePurchaseAttraction:(NSString *)attractionId)

RCT_EXTERN_METHOD(presentPurchase:(NSString *)eventId)

@end
