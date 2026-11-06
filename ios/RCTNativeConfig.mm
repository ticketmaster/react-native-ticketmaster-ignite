#import "RCTNativeConfig.h"
#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>

#import "TMIgniteConfigStore.h"

@implementation RCTNativeConfig

- (instancetype)init {
  if (self = [super init]) {
    // A new module instance means a new JavaScript runtime, which re-pushes its configuration;
    // start from an empty store so values from a previous runtime cannot leak through.
    [TMIgniteConfigStore.shared removeAll];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeConfigSpecJSI>(params);
}

- (void)setConfig:(NSString *)key value:(NSString *)value {
  [TMIgniteConfigStore.shared setConfig:key value:value];
}

- (void)setImage:(NSString *)key uri:(NSString *)uri {
  [TMIgniteConfigStore.shared setImage:key uri:uri];
}

+ (NSString *)moduleName {
  return @"NativeConfig";
}

@end
