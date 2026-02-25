import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Option "mo:core/Option";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import UserApproval "user-approval/approval";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  // OTP Storage implementation
  let OTP_EXPIRY_MINS = 5;
  let otpStore = Map.empty<Text, (Text, Int)>();

  public shared ({ caller }) func generateOtp(phone : Text) : async Text {
    let otp = generateRandomOtp();
    let expiryTime = Time.now() + (OTP_EXPIRY_MINS * 60 * 1000000000);
    otpStore.add(phone, (otp, expiryTime));
    otp;
  };

  public shared ({ caller }) func verifyOtp(phone : Text, otp : Text) : async Bool {
    switch (otpStore.get(phone)) {
      case (null) { false };
      case (?(storedOtp, expiryTime)) {
        if (Time.now() > expiryTime) {
          otpStore.remove(phone);
          false;
        } else if (storedOtp == otp) {
          otpStore.remove(phone);
          true;
        } else {
          false;
        };
      };
    };
  };

  func generateRandomOtp() : Text {
    let randomNum = 123456; // Placeholder, implement random number generation here.
    formatOtp(randomNum);
  };

  func formatOtp(num : Nat) : Text {
    let numStr = num.toText();
    let charsNeeded = 6 - numStr.size();
    var leadingZeros = "";
    var i = 0;
    while (i < charsNeeded) {
      leadingZeros #= "0";
      i += 1;
    };
    leadingZeros # numStr;
  };

  type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  type Customer = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    createdAt : Int;
  };

  type CustomerInternal = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    password : Text;
    createdAt : Int;
  };

  type AuthState = {
    adminSessionActive : Bool;
    customerSessions : Map.Map<Nat, Bool>;
    nextCustomerId : Nat;
    adminPassword : Text;
  };

  // Marking it as stable instead of anonymous var
  var authState : AuthState = {
    adminSessionActive = false;
    customerSessions = Map.empty<Nat, Bool>();
    nextCustomerId = 1;
    adminPassword = "p1love2g";
  };

  let REFUND_STATUS_PENDING = "pending";
  let REFUND_STATUS_APPROVED = "approved";
  let REFUND_STATUS_REJECTED = "rejected";
  let REFUND_STATUS_PROCESSED = "processed";

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    stock : Nat;
    isAvailable : Bool;
    medicineType : Text;
    requiresPrescription : Bool;
    sellerId : ?Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    price : Nat;
  };

  type Order = {
    id : Nat;
    customerId : ?Nat;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    items : [OrderItem];
    totalAmount : Nat;
    upiTransactionRef : Text;
    status : Text;
    createdAt : Int;
  };

  type Refund = {
    refundId : Nat;
    orderId : Nat;
    reason : Text;
    amount : Nat;
    status : Text;
    timestamp : Int;
  };

  type CustomerInquiry = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  type SellerPublic = {
    id : Text;
    storeName : Text;
    ownerName : Text;
    email : Text;
    phone : Text;
    aadhaarNumber : Text;
    panNumber : Text;
    medicalLicenseNumber : Text;
    verificationStatus : Text;
    isActive : Bool;
    createdAt : Int;
  };

  type Seller = {
    id : Text;
    storeName : Text;
    ownerName : Text;
    email : Text;
    phone : Text;
    passwordHash : Text;
    aadhaarNumber : Text;
    panNumber : Text;
    medicalLicenseNumber : Text;
    verificationStatus : Text;
    isActive : Bool;
    createdAt : Int;
  };

  let customers = Map.empty<Nat, CustomerInternal>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let refunds = Map.empty<Nat, Refund>();
  let sellers = Map.empty<Text, Seller>();

  var nextProductId = 1;
  var nextOrderId = 1;
  var nextRefundId = 1;

  let inquiries = List.empty<CustomerInquiry>();

  func toSellerPublic(s : Seller) : SellerPublic {
    {
      id = s.id;
      storeName = s.storeName;
      ownerName = s.ownerName;
      email = s.email;
      phone = s.phone;
      aadhaarNumber = s.aadhaarNumber;
      panNumber = s.panNumber;
      medicalLicenseNumber = s.medicalLicenseNumber;
      verificationStatus = s.verificationStatus;
      isActive = s.isActive;
      createdAt = s.createdAt;
    };
  };

  public query func isAdminLoggedIn() : async Bool {
    authState.adminSessionActive;
  };

  public query func isCustomerLoggedIn(customerId : Nat) : async Bool {
    switch (authState.customerSessions.get(customerId)) {
      case (?active) { active };
      case (null) { false };
    };
  };

  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    let isAdminUser = email == "gauravsaswade2009@gmail.com" and password == authState.adminPassword;
    if (isAdminUser) {
      authState := {
        authState with
        adminSessionActive = true;
      };
    };
    isAdminUser;
  };

  public shared ({ caller }) func customerRegister(name : Text, phone : Text, email : Text, password : Text) : async Nat {
    switch (customers.values().find(func(c) { c.email == email })) {
      case (null) {
        let customerId = authState.nextCustomerId;
        authState := {
          authState with nextCustomerId = customerId + 1;
        };
        let customer : CustomerInternal = {
          id = customerId;
          name;
          phone;
          email;
          password;
          createdAt = Time.now();
        };
        customers.add(customerId, customer);
        customerId;
      };
      case (?_) {
        Runtime.trap("An account with this email already exists.");
      };
    };
  };

  public shared ({ caller }) func customerLogin(email : Text, password : Text) : async Nat {
    let customerOpt = customers.values().find(func(c) { c.email == email });
    switch (customerOpt) {
      case (null) { Runtime.trap("Invalid username or password") };
      case (?customer) {
        if (customer.password == password) {
          authState.customerSessions.add(customer.id, true);
          customer.id;
        } else {
          Runtime.trap("Invalid email or password");
        };
      };
    };
  };

  public query ({ caller }) func getCustomerById(customerId : Nat) : async Customer {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let hasSession = switch (authState.customerSessions.get(customerId)) {
      case (?active) { active };
      case (null) { false };
    };
    if (not isAdmin and not hasSession) {
      Runtime.trap("Unauthorized: Cannot view another customer's profile");
    };
    switch (customers.get(customerId)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customerRecord) {
        {
          id = customerRecord.id;
          name = customerRecord.name;
          phone = customerRecord.phone;
          email = customerRecord.email;
          createdAt = customerRecord.createdAt;
        };
      };
    };
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    image : Storage.ExternalBlob,
    stock : Nat,
    isAvailable : Bool,
    medicineType : Text,
    requiresPrescription : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      name;
      description;
      price;
      category;
      image;
      stock;
      isAvailable;
      medicineType;
      requiresPrescription;
      sellerId = null;
    };

    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProductWithImage(
    id : Nat,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    image : Storage.ExternalBlob,
    stock : Nat,
    isAvailable : Bool,
    medicineType : Text,
    requiresPrescription : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let product : Product = {
          id;
          name;
          description;
          price;
          category;
          image;
          stock;
          isAvailable;
          medicineType;
          requiresPrescription;
          sellerId = existingProduct.sellerId;
        };
        products.add(id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared func placeOrder(
    customerName : Text,
    customerPhone : Text,
    customerAddress : Text,
    items : [OrderItem],
    totalAmount : Nat,
    upiTransactionRef : Text,
  ) : async Nat {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      customerId = null;
      customerName;
      customerPhone;
      customerAddress;
      items;
      totalAmount;
      upiTransactionRef;
      status = "pending";
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func placeOrderWithCustomer(
    customerId : Nat,
    items : [OrderItem],
    totalAmount : Nat,
    upiTransactionRef : Text,
  ) : async Nat {
    let hasSession = switch (authState.customerSessions.get(customerId)) {
      case (?active) { active };
      case (null) { false };
    };
    if (not hasSession and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be logged in as this customer to place an order");
    };
    switch (customers.get(customerId)) {
      case (null) { Runtime.trap("Invalid customerId. Please register an account first.") };
      case (?customer) {
        let orderId = nextOrderId;
        nextOrderId += 1;

        let order : Order = {
          id = orderId;
          customerId = ?customerId;
          customerName = customer.name;
          customerPhone = customer.phone;
          customerAddress = "N/A";
          items;
          totalAmount;
          upiTransactionRef;
          status = "pending";
          createdAt = Time.now();
        };

        orders.add(orderId, order);
        orderId;
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrderById(id : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view order details");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customerId = order.customerId;
          customerName = order.customerName;
          customerPhone = order.customerPhone;
          customerAddress = order.customerAddress;
          items = order.items;
          totalAmount = order.totalAmount;
          upiTransactionRef = order.upiTransactionRef;
          status;
          createdAt = order.createdAt;
        };
        orders.add(id, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func requestRefund(orderId : Nat, reason : Text, amount : Nat) : async () {
    let refundId = nextRefundId;
    nextRefundId += 1;

    let refund : Refund = {
      refundId;
      orderId;
      reason;
      amount;
      status = REFUND_STATUS_PENDING;
      timestamp = Time.now();
    };

    refunds.add(refundId, refund);
  };

  public query ({ caller }) func getRefunds() : async [Refund] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view refunds");
    };
    refunds.values().toArray();
  };

  public shared ({ caller }) func updateRefundStatus(refundId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update refund status");
    };

    switch (refunds.get(refundId)) {
      case (null) { Runtime.trap("Refund not found") };
      case (?refund) {
        let updatedRefund : Refund = {
          refundId = refund.refundId;
          orderId = refund.orderId;
          reason = refund.reason;
          amount = refund.amount;
          status;
          timestamp = refund.timestamp;
        };
        refunds.add(refundId, updatedRefund);
      };
    };
  };

  public query func getCategories() : async [Text] {
    let categorySet = Set.empty<Text>();
    products.values().forEach(
      func(product) { categorySet.add(product.category) }
    );
    categorySet.values().toArray();
  };

  public shared func submitInquiry(name : Text, phone : Text, message : Text) : async () {
    let inquiry : CustomerInquiry = {
      name;
      phone;
      message;
      timestamp = Time.now();
    };
    inquiries.add(inquiry);
  };

  public query ({ caller }) func getInquiries() : async [CustomerInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.toArray();
  };

  public shared ({ caller }) func sellerRegister(
    storeName : Text,
    ownerName : Text,
    email : Text,
    phone : Text,
    passwordHash : Text,
    aadhaarNumber : Text,
    panNumber : Text,
    medicalLicenseNumber : Text,
  ) : async Text {
    let sellerId = email;

    switch (sellers.get(sellerId)) {
      case (?_) { Runtime.trap("Seller with this email already exists.") };
      case (null) {
        let seller : Seller = {
          id = sellerId;
          storeName;
          ownerName;
          email;
          phone;
          passwordHash;
          aadhaarNumber;
          panNumber;
          medicalLicenseNumber;
          verificationStatus = "pending";
          isActive = true;
          createdAt = Time.now();
        };

        sellers.add(sellerId, seller);
        sellerId;
      };
    };
  };

  public shared ({ caller }) func sellerLogin(email : Text, passwordHash : Text) : async Bool {
    switch (sellers.get(email)) {
      case (null) { Runtime.trap("Seller not found.") };
      case (?seller) {
        if (seller.passwordHash == passwordHash) {
          true;
        } else {
          Runtime.trap("Invalid email or password.");
        };
      };
    };
  };

  public query ({ caller }) func getSellerById(id : Text) : async ?SellerPublic {
    sellers.get(id).map(toSellerPublic);
  };

  public query ({ caller }) func getSellers() : async [SellerPublic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all sellers");
    };
    sellers.values().map(toSellerPublic).toArray();
  };

  public shared ({ caller }) func updateSellerVerificationStatus(sellerId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update seller verification status");
    };

    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Seller not found.") };
      case (?seller) {
        let updatedSeller : Seller = {
          id = seller.id;
          storeName = seller.storeName;
          ownerName = seller.ownerName;
          email = seller.email;
          phone = seller.phone;
          passwordHash = seller.passwordHash;
          aadhaarNumber = seller.aadhaarNumber;
          panNumber = seller.panNumber;
          medicalLicenseNumber = seller.medicalLicenseNumber;
          verificationStatus = status;
          isActive = status == "verified";
          createdAt = seller.createdAt;
        };
        sellers.add(sellerId, updatedSeller);
      };
    };
  };

  public query ({ caller }) func getSellerProducts(sellerId : Text) : async [Product] {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Seller not found.") };
      case (?_) {
        let sellerProducts = products.values().filter(
          func(p) {
            switch (p.sellerId) {
              case (?sid) { sid == sellerId };
              case (null) { false };
            };
          }
        );
        sellerProducts.toArray();
      };
    };
  };

  public shared ({ caller }) func addSellerProduct(
    sellerId : Text,
    passwordHash : Text,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    image : Storage.ExternalBlob,
    stock : Nat,
    isAvailable : Bool,
    medicineType : Text,
    requiresPrescription : Bool,
  ) : async Nat {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Invalid sellerId. Please register as a seller.") };
      case (?seller) {
        if (seller.passwordHash != passwordHash) {
          Runtime.trap("Unauthorized: Invalid seller credentials.");
        };
        if (seller.verificationStatus != "verified") {
          Runtime.trap("Your seller profile is not verified yet.");
        };
        let productId = nextProductId;
        nextProductId += 1;

        let product : Product = {
          id = productId;
          name;
          description;
          price;
          category;
          image;
          stock;
          isAvailable;
          medicineType;
          requiresPrescription;
          sellerId = ?sellerId;
        };

        products.add(productId, product);
        productId;
      };
    };
  };

  public shared ({ caller }) func updateSellerProductWithImage(
    sellerId : Text,
    passwordHash : Text,
    id : Nat,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    image : Storage.ExternalBlob,
    stock : Nat,
    isAvailable : Bool,
    medicineType : Text,
    requiresPrescription : Bool,
  ) : async () {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Invalid sellerId. Please register as a seller.") };
      case (?seller) {
        if (seller.passwordHash != passwordHash) {
          Runtime.trap("Unauthorized: Invalid seller credentials.");
        };
        if (seller.verificationStatus != "verified") {
          Runtime.trap("Your seller profile is not verified yet.");
        };
        switch (products.get(id)) {
          case (null) { Runtime.trap("Product not found") };
          case (?product) {
            if (product.sellerId != ?sellerId) {
              Runtime.trap("Unauthorized: You are not the owner of this product.");
            };
            let updatedProduct : Product = {
              id;
              name;
              description;
              price;
              category;
              image;
              stock;
              isAvailable;
              medicineType;
              requiresPrescription;
              sellerId = product.sellerId;
            };
            products.add(id, updatedProduct);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteSellerProduct(sellerId : Text, passwordHash : Text, productId : Nat) : async () {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Invalid sellerId. Please register as a seller.") };
      case (?seller) {
        if (seller.passwordHash != passwordHash) {
          Runtime.trap("Unauthorized: Invalid seller credentials.");
        };
        if (seller.verificationStatus != "verified") {
          Runtime.trap("Your seller profile is not verified yet.");
        };
        switch (products.get(productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?product) {
            if (product.sellerId != ?sellerId) {
              Runtime.trap("Unauthorized: You are not the owner of this product.");
            };
            products.remove(productId);
          };
        };
      };
    };
  };

  public query ({ caller }) func getSellerOrders(sellerId : Text, passwordHash : Text) : async [Order] {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Invalid sellerId. Please register as a seller.") };
      case (?seller) {
        if (seller.passwordHash != passwordHash) {
          Runtime.trap("Unauthorized: Invalid seller credentials.");
        };
        let sellerProductIds = Set.empty<Nat>();
        products.values().forEach(func(p) {
          switch (p.sellerId) {
            case (?sid) {
              if (sid == sellerId) { sellerProductIds.add(p.id) };
            };
            case (null) {};
          };
        });

        let sellerOrders = orders.values().filter(
          func(order) {
            order.items.any(func(item) { sellerProductIds.contains(item.productId) });
          }
        );
        sellerOrders.toArray();
      };
    };
  };

  public query ({ caller }) func getSellerDashboard(sellerId : Text, passwordHash : Text) : async Text {
    switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Seller not found.") };
      case (?seller) {
        if (seller.passwordHash != passwordHash) {
          Runtime.trap("Unauthorized: Invalid seller credentials.");
        };
        if (seller.verificationStatus != "verified") {
          Runtime.trap("Your seller profile is not verified yet.");
        };
        "Welcome to your seller dashboard, " # seller.storeName # ". You can manage your products, orders, and profile here.";
      };
    };
  };
};
