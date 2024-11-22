#import <React/RCTBridgeModule.h>

@interface ConfigModule : NSObject <RCTBridgeModule>

// Declare any public properties or methods you want other classes to access.
- (NSString *)getConfig:(NSString *)key;
- (UIImage *)getImage:(NSString *)key;
- (void)setConfig:(NSString *)key value:(NSString *)value;
- (void)setImage:(NSString *)key value:(NSDictionary *)value;

@end
