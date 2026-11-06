#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Retail (Purchase / PrePurchase) SDK operations used by the `NativeRetailSdk` TurboModule.
/// Implemented in Swift by `RetailSDK`; obtained through `TMIgniteSwiftFactory`.
@protocol TMIgniteRetailSDK <NSObject>

- (void)presentPrePurchaseVenueWithVenueId:(NSString *)venueId NS_SWIFT_NAME(presentPrePurchaseVenue(venueId:));
- (void)presentPrePurchaseAttractionWithAttractionId:(NSString *)attractionId NS_SWIFT_NAME(presentPrePurchaseAttraction(attractionId:));
- (void)presentPurchaseWithEventId:(NSString *)eventId NS_SWIFT_NAME(presentPurchase(eventId:));

@end

NS_ASSUME_NONNULL_END
