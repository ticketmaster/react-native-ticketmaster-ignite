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
    NSString *imagePath = [configValues objectForKey:key];
    
    // // Remove the "file://" prefix 
    if ([imagePath hasPrefix:@"file://"]) {
        imagePath = [imagePath substringFromIndex:7]; 
    }
    
    // Load the image from the bundle (production) or from a URL (development)
    if ([imagePath hasPrefix:@"http://"] || [imagePath hasPrefix:@"https://"]) {
        NSLog(@"loading image from URL: %@", imagePath);
      
        NSData *imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imagePath]];
      
        if (imageData) {
            return [UIImage imageWithData:imageData];
        } else {
            NSLog(@"Failed to load image from URL: %@", imagePath);
            return nil;
        }
    } else {
        NSLog(@"loading image from bundle: %@", imagePath);
      
        NSString *path = [NSString stringWithFormat:@"%@", imagePath];
        UIImage *image = [UIImage imageWithContentsOfFile:path];
      
        if (!image) {
            NSLog(@"Failed to load image from path: %@", path);
          return nil;
        }
        return image;
    }
}

@end
