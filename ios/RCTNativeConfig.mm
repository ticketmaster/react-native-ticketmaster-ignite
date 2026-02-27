#import "RCTNativeConfig.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>


@implementation RCTNativeConfig {
  NSMutableDictionary *_configValues;
}

- (instancetype)init {
  if (self = [super init]) {
    _configValues = [NSMutableDictionary new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeConfigSpecJSI>(params);
}


- (void)setConfig:(NSString *)key value:(NSString *)value {
  _configValues[key] = value;
}

- (void)setImage:(NSString *)key uri:(NSString *)uri {
  _configValues[key] = uri;
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

+ (NSString *)moduleName
{
  return @"NativeConfig";
}

@end
