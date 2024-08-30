//
//  TDLib.m
//  killogram
//
//  Created by Macbook on 2024/8/31.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(TDLib ,NSObject);

RCT_EXTERN_METHOD(createClient:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

//RCT_EXTERN_METHOD(json_client_create:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(json_client_create:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

 
// Expose the td_send method to React Native
RCT_EXTERN_METHOD(send:(int)clientId request:(NSString *)request)

// Expose the td_json_client_send method to React Native
RCT_EXTERN_METHOD(json_client_send:(nonnull NSNumber *)clients request:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)


// Expose the td_execute method to React Native
RCT_EXTERN_METHOD(execute:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Expose the td_json_client_execute method to React Native
RCT_EXTERN_METHOD(json_client_execute:(nonnull NSNumber *)client request:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(json_client_destroy:(nonnull NSNumber *)client resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(json_client_receive:(nonnull NSNumber *)client timeout:(nonnull NSNumber *)timeout resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(receive:(nonnull NSNumber *)timeout resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startUpdateListener:(nonnull NSNumber *)client resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stopUpdateListener:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
