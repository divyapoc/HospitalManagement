import { query } from "express";
import contactSchema from "./contact.model.js";
import twilio from "twilio";
async function Contact(req, res, next) {
  try {
    console.log(req);
    let data = new contactSchema(req);
    let result = await data.save();
    console.log("contact", result);
    return res.json({
      status: "success",
      message: "your Query submitted",
      result: result,
    });
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

async function Query(req, res, next) {
  try {
    let data = await contactSchema.find({ query_type: "query" }).exec();
    if (data) {
      return res.json({
        status: true,
        message: "Query from users  are fetched",
        data,
      });
    } else {
      return res.json({ status: false, message: "No query yet", data });
    }
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

async function Feedback(req, res, next) {
  try {
    let data = await contactSchema.find({ query_type: "feedback" }).exec();
    if (data) {
      return res.json({ status: true, message: "feedback from user", data });
    } else {
      return res.json({ status: false, message: "No feedback yet", data });
    }
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

async function Complaint(req, res, next) {
  try {
    let data = await contactSchema.find({ query_type: "complaint" }).exec();
    if (data) {
      return res.json({ status: true, message: "complaint from user", data });
    } else {
      return res.json({ status: false, message: "No complaint yet", data });
    }
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

async function Allmessage(req, res, next) {
  try {
    let data = await contactSchema.find().exec();
    if (data) {
      return res.json({ status: true, message: "messages from user", data });
    } else {
      return res.json({ status: false, message: "No data", data });
    }
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

async function reply(req, res, next) {
  try {
    const detail = req.body.messages;
    console.log("det", detail);
    console.log("que", req.query);
    let data = await contactSchema
      .findOne({ contact_id: req.query.contact_id })
      .exec();
    const account_Sid = process.env.account_Sid;
    const auth_Token = process.env.auth_Token;
    const userTwilio = new twilio(account_Sid, auth_Token);
    let message = await userTwilio.messages.create({
      from: "+13868543166",
      //to: `+91${data.mobile}`,
      to: "+917339080287",
      body: `Hi ${data.username}\n${detail}`,
    });
    if (message) {
      const status = await contactSchema.findOneAndUpdate(
        { contact_id: req.query.contact_id },
        { reply_status: true },
        { new: true }
      );
      return res.json({ status: true, message: "replied", message });
    } else {
      return res.json({ status: false, message: "something went wrong" });
    }
  } catch (error) {
    return res.json({ status: "error found", message: error.message });
  }
}

export default {
  Contact,
  Query,
  Feedback,
  Complaint,
  Allmessage,
  reply,
};
