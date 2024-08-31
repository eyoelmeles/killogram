//
//  TDLib.swift
//  killogram
//
//  Created by Macbook on 2024/8/31.
//

import Foundation
import React
import TDLibFramework

@objc(TDLib)
class TDLib: RCTEventEmitter {
  private var updateListenerActive: Bool = false
  private var client: UnsafeMutableRawPointer?

  override static func moduleName() -> String! {
    return "TDLib"
  }

  @objc
  func createClient(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard client == nil else {
      resolve("Client already created")
      return
    }

    client = td_json_client_create()
    if client == nil {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("ERROR_ON_CLIENT", "Failed to create client", error)
    } else {
      resolve("Client created successfully")
    }
  }

  @objc
  func json_client_send(_ request: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let clientPointer = client else {
      reject("NO_CLIENT", "Client not created", nil)
      return
    }

    let requestString = request as String
    requestString.withCString { cStringRequest in
      td_json_client_send(clientPointer, cStringRequest)
    }

    DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
      resolve("Request sent successfully")
    }
  }

  @objc func execute(_ request: NSString) -> NSString? {
    let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
    if let resultCString = td_execute(requestCString) {
      return NSString(utf8String: resultCString)
    }
    return nil
  }

  @objc func send(_ request: NSString) {
    guard let clientPointer = client else {
      print("Client not created")
      return
    }

    let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
    td_send(Int32(truncating: NSNumber(value: Int(bitPattern: clientPointer))), requestCString)
    
  }

  @objc(json_client_execute:resolve:reject:)
  func json_client_execute(_ request: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let clientPointer = client else {
      reject("NO_CLIENT", "Client not created", nil)
      return
    }

    let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
    if let resultCString = td_json_client_execute(clientPointer, requestCString) {
      resolve(String(cString: resultCString))
    } else {
      reject("td_json_client_execute_error", "Failed to execute client request", nil)
    }
  }

  @objc
  func json_client_destroy(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let clientPointer = client else {
      reject("NO_CLIENT", "Client not created", nil)
      return
    }

    td_json_client_destroy(clientPointer)
    client = nil
    resolve("Client destroyed")
  }

  @objc
  func json_client_receive(_ timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let clientPointer = client else {
      reject("NO_CLIENT", "Client not created", nil)
      return
    }

    if let responseCString = td_json_client_receive(clientPointer, timeout) {
      resolve(String(cString: responseCString))
    } else {
      reject("td_json_client_receive_error", "Failed to receive response", nil)
    }
  }

  @objc
  func receive(_ timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    if let responseCString = td_receive(timeout) {
      resolve(String(cString: responseCString))
    } else {
      reject("td_receive_error", "Failed to receive response", nil)
    }
  }

  
  @objc func startUpdateListener(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard !updateListenerActive else {
      resolve("Listener already active")
      return
    }

    updateListenerActive = true
    let clientPointer = client

    DispatchQueue.global(qos: .background).async {
      while self.updateListenerActive {
        if let responseCString = td_json_client_receive(clientPointer, 10.0) {
          let update = String(cString: responseCString)
          self.sendEvent(withName: "onTelegramUpdate", body: update)
        }
      }
    }

    resolve("Listener started")
  }

  @objc
  func stopUpdateListener(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    updateListenerActive = false
    resolve("Listener stopped")
  }

  override func supportedEvents() -> [String]! {
    return ["onTelegramUpdate"]
  }

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

