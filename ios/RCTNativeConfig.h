#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeConfig : NSObject <NativeConfigSpec>

- (NSString * _Nullable)getConfig:(NSString *)key;
- (UIImage * _Nullable)getImage:(NSString *)key;
- (void)setConfig:(NSString *)key value:(NSString *)value;
- (void)setImage:(NSString *)key value:(NSDictionary *)value;

@end

NS_ASSUME_NONNULL_END
