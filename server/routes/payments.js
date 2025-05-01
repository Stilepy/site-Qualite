const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

router.post('/create', isAuthenticated, async (req, res) => {
  const { plan, serverId } = req.body;
  
  try {
    const plans = {
      'basic': { price: 3.00, description: 'Bot de Atendimento Básico' },
      'epro': { price: 6.99, description: 'Plano Epro Completo' }
    };
    
    if (!plans[plan]) {
      return res.status(400).json({ error: 'Plano inválido' });
    }
    
    // Criar preferência no Mercado Pago
    const preference = {
      items: [
        {
          title: `QualiteApps - ${plans[plan].description}`,
          unit_price: plans[plan].price,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: req.user.username,
        email: req.user.email || ''
      },
      external_reference: `${req.user.discordId}:${plan}:${serverId}`,
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      back_urls: {
        success: `${process.env.CLIENT_URL}/payment/success`,
        failure: `${process.env.CLIENT_URL}/payment/failure`,
        pending: `${process.env.CLIENT_URL}/payment/pending`
      },
      auto_return: 'approved'
    };
    
    const response = await mercadopago.preferences.create(preference);
    
    const payment = new Payment({
      userId: req.user._id,
      plan,
      amount: plans[plan].price,
      method: 'mercadopago',
      status: 'pending',
      transactionId: response.body.id,
      paymentLink: response.body.init_point,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });
    
    await payment.save();
    
    res.json({
      id: payment._id,
      paymentLink: response.body.init_point
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      const { status, external_reference } = payment.body;
      
      if (external_reference) {
        const [discordId, plan, serverId] = external_reference.split(':');
       
        await Payment.findOneAndUpdate(
          { transactionId: data.id },
          { status: status === 'approved' ? 'approved' : status }
        );
        
        if (status === 'approved') {
          const user = await User.findOne({ discordId });
          
          if (user) {
            user.premium = {
              isActive: true,
              plan,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
              servers: [...(user.premium?.servers || []), { id: serverId, name: 'Servidor Discord' }]
            };
            
            await user.save();
            
            // TODO: Enviar mensagem para o Discord do usuário
            // TODO: Ativar bot no servidor especificado
          }
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro interno');
  }
});

router.get('/status/:id', isAuthenticated, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment || payment.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    
    res.json({
      status: payment.status,
      plan: payment.plan,
      amount: payment.amount,
      createdAt: payment.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;