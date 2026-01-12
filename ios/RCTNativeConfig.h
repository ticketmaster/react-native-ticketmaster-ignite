#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol NativeConfigSpec;

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeConfig : NSObject <NativeConfigSpec>

- (NSString *)getConfig:(NSString *)key;
- (UIImage *)getImage:(NSString *)key;
- (void)setConfig:(NSString *)key value:(NSString *)value;
- (void)setImage:(NSString *)key uri:(NSString *)uri;

@end

NS_ASSUME_NONNULL_END
