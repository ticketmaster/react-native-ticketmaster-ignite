#import "ConfigModule.h"

@implementation ConfigModule

RCT_EXPORT_MODULE(Config);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return true;
}

NSMutableDictionary *configValues;

RCT_EXPORT_METHOD(setConfig:(NSString *)key value:(NSString *)value) {
    if (!configValues) {
        configValues = [NSMutableDictionary dictionary];
    }
    [configValues setObject:value forKey:key];
}

- (NSString *)getConfig:(NSString *)key {
    return [configValues objectForKey:key];
}

@end
