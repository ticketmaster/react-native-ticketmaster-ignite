#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol NativeConfigSpec;

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeConfig : NSObject <NativeConfigSpec>

- (void)setConfig:(NSString *)key value:(NSString *)value;
- (void)setImage:(NSString *)key uri:(NSString *)uri;

+ (nullable NSString *)getConfig:(NSString *)key;
+ (nullable UIImage *)getImage:(NSString *)key;
+ (void)setConfig:(nullable NSString *)value forKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
