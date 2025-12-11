# 🧪 **COMPREHENSIVE TEST SUITE PLAN - Güero Gucci E-commerce**

## **📋 OVERVIEW**

This document outlines a comprehensive testing strategy for the Güero Gucci e-commerce application, covering all critical components:

- **Payment Processing** (Stripe integration)
- **Webhooks** (Stripe events)
- **API Routes** (5 endpoints)
- **Database Operations** (Supabase)
- **Cart Management** (Client-side state)
- **Email Notifications** (Resend)

---

## **1️⃣ PAYMENT FLOW TESTING**

### **Unit Tests: Stripe Integration (`app/lib/stripe.ts`)**

**Test Suite: `__tests__/unit/stripe.test.ts`**

#### ✅ Happy Path Tests
- Should create checkout session with valid data
- Should include all line items (products + shipping + tax)
- Should attach correct metadata (order_number, customer info, items)
- Should validate NEXT_PUBLIC_BASE_URL environment variable
- Should generate correct success_url with session_id placeholder
- Should generate correct cancel_url
- Should enable phone number collection
- Should restrict shipping to US, CA, MX

#### ❌ Error Handling Tests
- Should throw error when STRIPE_SECRET_KEY is missing
- Should throw error when line items are empty
- Should handle Stripe API errors gracefully
- Should handle network failures

#### 🔒 Security Tests
- Should validate webhook signature correctly
- Should reject invalid webhook signatures
- Should reject missing webhook signatures

---

### **Integration Tests: Payment Intent API (`app/api/create-payment-intent/route.ts`)**

**Test Suite: `__tests__/integration/create-payment-intent.integration.test.ts`**

#### ✅ Happy Path Tests
- Should create payment intent with complete order data
- Should generate unique order number (format: ORD-{timestamp}-{random})
- Should convert item images to absolute URLs
- Should handle relative image paths (starting with /)
- Should skip images without http/https protocol
- Should include shipping and tax as separate line items
- Should return sessionId, url, and orderNumber

#### ❌ Error Handling Tests
- Should return 400 when orderData is missing
- Should return 400 when items array is empty
- Should return 400 when customer_email is missing
- Should return 500 when Stripe API fails
- Should handle malformed JSON in request body

#### 🔄 Data Validation Tests
- Should calculate correct line item amounts (price * 100)
- Should preserve item color and size in line item description

---

## **2️⃣ WEBHOOK TESTING**

### **Unit Tests: Webhook Handler (`app/api/webhooks/stripe/route.ts`)**

**Test Suite: `__tests__/unit/stripe-webhook.test.ts`**

#### ✅ Happy Path Tests - checkout.session.completed
- Should create order when payment_status is 'paid'
- Should parse metadata correctly (shipping_address, items, totals)
- Should insert order with all required fields
- Should insert order_items for each product
- Should set payment_status to 'completed'
- Should set order_status to 'processing'
- Should trigger email confirmation
- Should use product_id from item or default to 0

#### ⚠️ Edge Case Tests
- Should skip order creation if payment_status is not 'paid'
- Should log warning when metadata is missing
- Should continue even if email sending fails

#### ❌ Error Handling Tests
- **checkout.session.expired** - Should not create order
- Should return 400 when signature is missing
- Should return 400 when signature is invalid
- Should handle JSON parse errors in metadata
- Should handle database errors gracefully
- Should rollback order_items if order creation fails

#### 🔄 Race Condition Tests
- Should handle duplicate webhook events (idempotency)
- Should handle race conditions (multiple webhooks for same session)

---

## **3️⃣ ORDER VERIFICATION TESTING**

### **Integration Tests: Verify Payment API (`app/api/verify-payment/route.ts`)**

**Test Suite: `__tests__/integration/verify-payment.integration.test.ts`**

#### ✅ Happy Path Tests
- Should verify successful payment with valid session_id
- Should return order with order_items
- Should return session payment_status and customer_email

#### ⏳ Race Condition Tests
- Should return 'processing: true' when order not yet created by webhook
- Should handle webhook delay gracefully (race condition)

#### ❌ Error Handling Tests
- Should return 400 when session_id is missing
- Should return 404 when session doesn't exist
- Should return success: false when payment_status is not 'paid'
- Should return 500 on Stripe API errors
- Should return 500 on database errors

#### 🔄 Data Validation Tests
- Should query by payment_intent_id correctly
- Should include all order_items in response

---

## **4️⃣ DATABASE OPERATIONS TESTING**

### **Unit Tests: Supabase Helpers (`app/lib/supabase.ts`)**

**Test Suite: `__tests__/unit/supabase.test.ts`**

#### Function: `generateOrderNumber()`
- ✅ Should generate unique order numbers
- ✅ Should follow format GG-{timestamp}-{random}
- ✅ Should be uppercase
- ✅ Should generate different numbers on subsequent calls

#### Function: `createOrder()`
- ✅ Should create order with all fields
- ✅ Should set payment_status to 'pending' by default
- ✅ Should set order_status to 'pending' by default
- ✅ Should create order_items for each item
- ✅ Should return created order
- ❌ Should throw error when required fields are missing
- ❌ Should throw error on database constraint violations
- ❌ Should handle duplicate order_number gracefully

#### Function: `updatePaymentStatus()`
- ✅ Should update payment_status to 'completed'
- ✅ Should update order_status to 'processing' when completed
- ✅ Should update payment_status to 'failed'
- ✅ Should keep order_status as 'pending' when failed
- ✅ Should update updated_at timestamp
- ❌ Should throw error when order doesn't exist

#### Function: `getOrderByNumber()`
- ✅ Should retrieve order with order_items
- ✅ Should return single order
- ❌ Should throw error when order not found

#### Function: `getOrders()`
- ✅ Should retrieve all orders ordered by created_at DESC
- ✅ Should filter by order_status
- ✅ Should filter by payment_status
- ✅ Should respect limit parameter
- ✅ Should respect offset parameter for pagination
- ✅ Should include order_items relation

---

## **5️⃣ CART MANAGEMENT TESTING**

### **Unit Tests: Cart Context (`app/lib/CartContext.tsx`)**

**Test Suite: `__tests__/unit/cart-context.test.tsx`**

#### ✅ Happy Path Tests
- Should initialize empty cart
- Should load cart from localStorage on mount
- Should save cart to localStorage on every change
- Should add item to cart
- Should assign unique cartId to each item
- Should remove item by cartId
- Should clear entire cart
- Should calculate total price correctly
- Should handle multiple items with same product but different color/size

#### ❌ Error Handling Tests
- Should handle corrupted localStorage data gracefully
- Should throw error when useCart is used outside CartProvider

#### 🔄 Persistence Tests
- Should persist cart across page reloads
- Should handle localStorage quota exceeded

---

## **6️⃣ EMAIL NOTIFICATION TESTING**

### **Integration Tests: Email Service (`app/lib/resend.ts`)**

**Test Suite: `__tests__/integration/email-notifications.test.ts`**

#### ✅ Happy Path Tests
- Should send order confirmation email
- Should include order number in email
- Should include customer name
- Should include all order items
- Should include subtotal, shipping, tax, total
- Should include shipping address

#### ❌ Error Handling Tests
- Should return error when RESEND_API_KEY is missing
- Should handle Resend API errors
- Should validate email format
- Should handle network timeouts

#### 🔄 Resilience Tests
- Should not block order creation if email fails

---

## **7️⃣ MIDDLEWARE TESTING (Future Implementation)**

### **Suggested Middleware Tests**

**Test Suite: `__tests__/middleware/middleware.test.ts`**

#### 🔐 Rate Limiting Middleware
- Should allow requests under rate limit
- Should block requests over rate limit
- Should reset rate limit after time window

#### 🔐 CORS Middleware
- Should allow requests from allowed origins
- Should block requests from unauthorized origins

#### 🔐 Webhook Signature Validation Middleware
- Should validate Stripe webhook signatures before processing
- Should reject requests with invalid signatures

---

## **8️⃣ END-TO-END USER SCENARIOS**

### **E2E Test Suite: `__tests__/e2e/checkout-flow.e2e.test.ts`**

#### **Scenario 1: Successful Purchase Flow**
1. User adds product to cart
2. Cart persists in localStorage
3. User proceeds to checkout
4. User fills shipping form
5. Payment intent is created
6. User is redirected to Stripe Checkout
7. User completes payment
8. Webhook creates order in database
9. User is redirected to success page
10. Order verification succeeds
11. Confirmation email is sent
12. Cart is cleared

#### **Scenario 2: Payment Cancellation**
1. User adds product to cart
2. User proceeds to checkout
3. Payment intent is created
4. User cancels at Stripe Checkout
5. User is redirected back to checkout page
6. Cart is preserved
7. No order is created

#### **Scenario 3: Webhook Delay Handling**
1. User completes payment at Stripe
2. User redirected to success page immediately
3. Webhook has not processed yet
4. verify-payment returns processing: true
5. Frontend shows loading state
6. Frontend retries verification
7. Order is found after retry
8. Success page displays order details

#### **Scenario 4: Network Failure Recovery**
1. User adds products to cart
2. Cart is saved to localStorage
3. Network fails during checkout
4. User sees error message
5. User retries
6. Cart data is preserved
7. Checkout completes successfully

---

## **9️⃣ EDGE CASES & ERROR SCENARIOS**

### **Critical Edge Cases to Test**

#### **Cart Edge Cases:**
- Empty cart checkout attempt
- Cart with 0-priced items
- Cart with extremely large quantities
- Concurrent cart modifications
- localStorage disabled/unavailable

#### **Payment Edge Cases:**
- Duplicate payment attempts
- Session expiration during checkout
- Partial payment failures
- Currency mismatch
- Amount below Stripe minimum ($0.50)
- Amount above Stripe maximum

#### **Webhook Edge Cases:**
- Duplicate webhook delivery
- Out-of-order webhook delivery
- Webhook replay attacks
- Malformed webhook payload
- Missing required metadata fields
- Database connection failures during webhook processing

#### **Database Edge Cases:**
- Order number collision
- Concurrent order creation
- Orphaned order_items (order creation failed)
- Database timeout during transaction
- Supabase RLS policy violations

---

## **🛠️ TESTING TOOLS & SETUP**

### **Recommended Testing Stack:**

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0",
    "stripe-mock": "^0.1.0",
    "playwright": "^1.40.0"
  }
}
```

### **Test Configuration Files Needed:**

#### `jest.config.js`
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!app/**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### `jest.setup.js`
```javascript
import '@testing-library/jest-dom';
```

### **Test Environment Variables:**

Create `.env.test` file:

```env
# Test environment
NODE_ENV=test
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxx

# Supabase Test Instance
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
SUPABASE_SERVICE_ROLE_KEY=test_service_key

# Resend Test API
RESEND_API_KEY=re_test_xxxxxxxxxxxxxxxxx
```

---

## **📊 COVERAGE GOALS**

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| API Routes | 100% | Critical |
| Database Operations | 100% | Critical |
| Payment Processing | 95% | Critical |
| Webhook Handlers | 100% | Critical |
| Cart Management | 90% | High |
| Email Notifications | 85% | Medium |
| UI Components | 70% | Low |

---

## **🚀 IMPLEMENTATION PHASES**

### **Phase 1: Foundation (Week 1)**
- [ ] Set up Jest and Testing Library
- [ ] Configure test environment variables
- [ ] Set up MSW for API mocking
- [ ] Write utility function tests
- [ ] Write cart context tests
- [ ] Set up code coverage reporting

### **Phase 2: API Testing (Week 2)**
- [ ] Test payment intent creation endpoint
- [ ] Test webhook handler endpoint
- [ ] Test verify payment endpoint
- [ ] Test orders endpoints
- [ ] Mock Stripe API calls
- [ ] Mock Supabase queries

### **Phase 3: Integration (Week 3)**
- [ ] Database operation integration tests
- [ ] Email notification integration tests
- [ ] Payment flow integration tests
- [ ] Test error recovery scenarios
- [ ] Test race conditions

### **Phase 4: E2E & Edge Cases (Week 4)**
- [ ] Set up Playwright for E2E tests
- [ ] Implement successful purchase flow
- [ ] Implement payment cancellation flow
- [ ] Implement webhook delay handling
- [ ] Test all edge cases
- [ ] Performance testing
- [ ] Load testing

---

## **📝 TEST NAMING CONVENTIONS**

### **Directory Structure:**
```
__tests__/
├── unit/
│   ├── stripe.test.ts
│   ├── supabase.test.ts
│   ├── cart-context.test.tsx
│   └── resend.test.ts
├── integration/
│   ├── create-payment-intent.integration.test.ts
│   ├── verify-payment.integration.test.ts
│   ├── stripe-webhook.integration.test.ts
│   └── email-notifications.integration.test.ts
├── e2e/
│   ├── checkout-flow.e2e.test.ts
│   ├── payment-cancellation.e2e.test.ts
│   └── webhook-delay.e2e.test.ts
└── mocks/
    ├── stripe.mock.ts
    ├── supabase.mock.ts
    └── resend.mock.ts
```

### **Test Case Naming:**
```javascript
describe('ComponentName or FunctionName', () => {
  describe('Happy Path', () => {
    it('should [expected behavior] when [condition]', () => {});
  });

  describe('Error Handling', () => {
    it('should throw [error] when [condition]', () => {});
  });

  describe('Edge Cases', () => {
    it('should handle [edge case] correctly', () => {});
  });
});
```

---

## **🔍 MONITORING & CONTINUOUS IMPROVEMENT**

### **Test Metrics to Track:**
- [ ] Test execution time
- [ ] Code coverage percentage
- [ ] Number of flaky tests
- [ ] Test failure rate
- [ ] Time to fix failing tests

### **CI/CD Integration:**
- [ ] Run tests on every PR
- [ ] Block merges if tests fail
- [ ] Generate coverage reports
- [ ] Run E2E tests on staging environment
- [ ] Performance benchmarks on main branch

---

## **🎯 SUCCESS CRITERIA**

**Tests are considered successful when:**

1. ✅ All critical paths are covered (100%)
2. ✅ Overall code coverage > 85%
3. ✅ All edge cases are tested
4. ✅ Tests run in < 5 minutes
5. ✅ Zero flaky tests
6. ✅ All error scenarios are handled
7. ✅ Integration tests cover all API endpoints
8. ✅ E2E tests cover complete user journeys

---

## **📚 ADDITIONAL RESOURCES**

### **Documentation:**
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

### **Best Practices:**
- Write tests before fixing bugs (TDD)
- Keep tests independent and isolated
- Use descriptive test names
- Mock external dependencies
- Test behavior, not implementation
- Avoid testing implementation details
- Keep tests simple and readable

---

**Document Version:** 1.0
**Last Updated:** 2025-12-10
**Status:** Planning Phase
**Next Review:** Before Phase 1 Implementation
