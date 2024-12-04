#import <React/RCTViewManager.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@interface RNTSecureEntryViewManager : RCTViewManager
@property (nonatomic, assign) NSString *token;
@property (strong) SecureEntryViewController *secureEntryViewController;

@end

@implementation RNTSecureEntryViewManager

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXPORT_MODULE(RNTSecureEntryView)
RCT_EXPORT_VIEW_PROPERTY(token, NSString)


- (UIView *)view
{
  self.secureEntryViewController = [[SecureEntryViewController alloc] init];
  return self.secureEntryViewController.view;
}

@end
