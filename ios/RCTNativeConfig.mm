#import "RCTNativeConfig.h"
#import <React/RCTConvert.h>

@implementation RCTNativeConfig {
  NSMutableDictionary *_configValues;
}

RCT_EXPORT_MODULE(NativeConfig)

- (instancetype)init {
  if (self = [super init]) {
    _configValues = [NSMutableDictionary new];
  }
  return self;
}


- (void)setConfig:(NSString *)key value:(NSString *)value {
  _configValues[key] = value;
}

- (void)setImage:(NSString *)key value:(NSDictionary *)value {
  _configValues[key] = value[@"uri"];
}


- (NSString *)getConfig:(NSString *)key {
  return _configValues[key];
}

- (UIImage *)getImage:(NSString *)key {
  NSString *imagePath = _configValues[key];
  if (!imagePath) return nil;

  if ([imagePath hasPrefix:@"file://"]) {
    imagePath = [imagePath substringFromIndex:7];
  }

  if ([imagePath hasPrefix:@"http"]) {
    NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:imagePath]];
    return data ? [UIImage imageWithData:data] : nil;
  }

  return [UIImage imageWithContentsOfFile:imagePath];
}

@end
