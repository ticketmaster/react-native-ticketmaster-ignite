#import "ConfigModule.h"
#import <React/RCTConvert.h>

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

RCT_EXPORT_METHOD(setImage:(NSString *)key value:(NSDictionary *)value) {
    if (!configValues) {
        configValues = [NSMutableDictionary dictionary];
    }
  
    [configValues setObject:value[@"uri"]	 forKey:key];
}

- (NSString *)getConfig:(NSString *)key {
    return [configValues objectForKey:key];
}

- (UIImage *)getImage:(NSString *)key {
      NSString *bundlePath = [[NSBundle mainBundle] resourcePath];
      NSString *path = [NSString stringWithFormat:@"%@/%@", bundlePath, [configValues objectForKey:key]];
  UIImage *img = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL fileURLWithPath:@"/Users/daniel.olugbade/Library/Developer/CoreSimulator/Devices/6F28700F-FEA8-4B76-A28A-E6B88DA423C5/data/Containers/Bundle/Application/4DDC2298-D50F-4D43-A778-C619C34BF6C7/TicketmasterIgniteExample.app/http://localhost:8081/assets/src/assets/images/food.jpeg"]]];
  
//  UIImage *image = [RCTConvert UIImage:imageObj];
//  UIImage *birdImage = [RCTConvert UIImage:@"/Users/daniel.olugbade/Library/Developer/CoreSimulator/Devices/6F28700F-FEA8-4B76-A28A-E6B88DA423C5/data/Containers/Bundle/Application/4DDC2298-D50F-4D43-A778-C619C34BF6C7/TicketmasterIgniteExample.app/assets/images/food.jpeg"];
  NSLog(@"%s", "this is the log");
  NSLog(@"%@", path);
//  NSLog(@"%s", "this is the log2");
//  NSLog(@"%@", birdImage);
      return img;
}


@end
