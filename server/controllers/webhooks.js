/*import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response
            .status(400)
            .send(`Webhook Error: ${error.message}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded" : {

          const paymentIntent = event.data.object;
          const sessionList = await stripe.checkout.sessions.list({
            payment_intent:  paymentIntent.id,

          })
          const session = sessionList.data[0]
          const {transactionId, appId}= session.metadata;
          if(appId=='quickgpt'){
            const transaction = await transaction.findOne({_id: transactionId, isPaid:false
            })
            //update credits in user account
            await User.updateOne({_id:transaction.userId}, {$inc:{credits: transaction.credits}})

            //update credit payment status

            transaction.isPaid = true;
            await transaction.save();


          }else{
            return response.json({received:true, message: "Ignored event: Invalid app"})
          }   
                 break;

        }
          default:
            confirm.log("Unhandled event type:", event.type)

            break;
      }
      response.json({received: true})

    } catch (error) {
      console.error("webhook processing errot", error)
      response.status(500).send("Intrernal server error")


    }
};*/
/*import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response
            .status(400)
            .send(`Webhook Error: ${error.message}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded" : {

          const paymentIntent = event.data.object;
          const sessionList = await stripe.checkout.sessions.list({
            payment_intent:  paymentIntent.id,

          })
          const session = sessionList.data[0]
          const {transactionId, appId}= session.metadata;
          if(appId=='quickgpt'){
            const transaction = await transaction.findOne({_id: transactionId, isPaid:false
            })
            //update credits in user account
            await User.updateOne({_id:transaction.userId}, {$inc:{credits: transaction.credits}})

            //update credit payment status

            transaction.isPaid = true;
            await transaction.save();


          }else{
            return response.json({received:true, message: "Ignored event: Invalid app"})
          }   
                 break;

        }
          default:
            confirm.log("Unhandled event type:", event.type)

            break;
      }
      response.json({received: true})

    } catch (error) {
      console.error("webhook processing errot", error)
      response.status(500).send("Intrernal server error")


    }
};*/
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook Signature Error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("Payment Intent Succeeded");

        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (!sessionList.data.length) {
          return response.status(404).json({
            success: false,
            message: "Checkout session not found",
          });
        }

        const session = sessionList.data[0];

        const { transactionId, appId } = session.metadata;

        if (appId !== "quickgpt") {
          return response.json({
            received: true,
            message: "Ignored event: Invalid app",
          });
        }

        const transaction = await Transaction.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) {
          return response.status(404).json({
            success: false,
            message: "Transaction not found or already paid",
          });
        }

        // Add credits to user
        await User.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        // Mark transaction as paid
        transaction.isPaid = true;
        await transaction.save();

        console.log("Transaction updated successfully");

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    return response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
