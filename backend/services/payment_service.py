import razorpay
from config import config

class PaymentService:
    def __init__(self):
        if config.RAZORPAY_KEY_ID and config.RAZORPAY_KEY_SECRET:
            self.client = razorpay.Client(auth=(config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET))
        else:
            self.client = None

    def create_order(self, amount: int, currency: str = 'INR'):
        if not self.client:
            # For demo purposes, if keys aren't set, return a mock order
            return {'id': 'order_mock123', 'amount': amount, 'currency': currency}
        data = {'amount': amount, 'currency': currency, 'payment_capture': '1'}
        return self.client.order.create(data=data)

    def verify_signature(self, payment_id: str, order_id: str, signature: str):
        if not self.client:
            return True # Mock success
        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
            return True
        except Exception:
            return False

payment_service = PaymentService()
