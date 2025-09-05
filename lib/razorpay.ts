import Razorpay from 'razorpay';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Razorpay configuration
export const razorpayConfig = {
  currency: 'INR',
  receipt_prefix: 'order_',
  theme: {
    color: '#3B82F6'
  },
  prefill: {
    method: 'card'
  },
  config: {
    display: {
      blocks: {
        utib: {
          name: 'Pay using Axis Bank',
          instruments: [
            {
              method: 'card',
              issuers: ['UTIB']
            },
            {
              method: 'netbanking',
              banks: ['UTIB']
            }
          ]
        },
        other: {
          name: 'Other Payment Methods',
          instruments: [
            {
              method: 'card'
            },
            {
              method: 'netbanking'
            },
            {
              method: 'upi'
            },
            {
              method: 'wallet'
            }
          ]
        }
      },
      hide: [
        {
          method: 'emi'
        }
      ],
      sequence: ['block.utib', 'block.other']
    }
  }
};

// Payment method options
export const paymentMethods = {
  card: {
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: '💳'
  },
  upi: {
    name: 'UPI',
    description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
    icon: '📱'
  },
  netbanking: {
    name: 'Net Banking',
    description: 'Pay directly from your bank account',
    icon: '🏦'
  },
  wallet: {
    name: 'Wallets',
    description: 'Pay using digital wallets',
    icon: '👛'
  }
};

// Helper function to create order
export async function createRazorpayOrder(amount: number, currency: string = 'INR') {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `${razorpayConfig.receipt_prefix}${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

// Helper function to verify payment
export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
}

// Types for Razorpay
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}