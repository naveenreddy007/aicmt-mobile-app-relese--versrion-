import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayPayment } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { sendOrderConfirmation } from '@/app/actions/send-email';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      shipping_address
    } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient();

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the payment signature
    const isValidPayment = await verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidPayment) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get the order from database
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status to completed
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        payment_status: 'paid',
        razorpay_payment_id,
        shipping_address: shipping_address || order.shipping_address,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Clear user's cart after successful payment
    const { error: cartClearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (cartClearError) {
      console.error('Error clearing cart:', cartClearError);
      // Don't fail the request if cart clearing fails
    }

    // Update product inventory (reduce stock)
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const { error: inventoryError } = await supabase.rpc(
          'update_product_inventory',
          {
            product_id: item.product_id,
            quantity_sold: item.quantity
          }
        );

        if (inventoryError) {
          console.error('Error updating inventory for product:', item.product_id, inventoryError);
          // Continue with other items even if one fails
        }
      }
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmation(user.email!, {
        id: updatedOrder.id,
        created_at: updatedOrder.created_at,
        status: 'confirmed',
        total_amount: updatedOrder.total_amount,
        items: order.items.map(item => ({
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price
        }))
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the payment verification if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
      redirect_url: `/orders/${updatedOrder.id}`
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}