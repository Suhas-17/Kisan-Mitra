const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51L7xDNSAyq7WW2HR7RDDwgTtesw87YVUwbMvnif9eKSlb0AGMs5ZfbzFBDxL0CT2XUfJHZNEmjajv59gsG6c5wZE00Y0KiwAiJ"
);
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { v1: uuidv1 } = require("uuid");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "kisan-mitra-f388f.appspot.com",
});

const { getStorage } = require("firebase-admin/storage");

const storage = getStorage();
const bucket = getStorage().bucket();

const db = getFirestore();

const pdf = require("html-pdf");
const pdfTemplate = require("./documents");

async function uploadToCloud(userId, orderId, data, buffer) {
  const file = await bucket.file(`invoice/${orderId}.pdf`);
  await file.save(buffer, {
    contentType: "application/pdf",
  });
  const options = {
    action: "read",
    expires: "03-17-2100",
  };

  // Get a signed URL for the file
  const url = await file.getSignedUrl(options).then((results) => {
    return results[0];
  });

  const batch = await db.batch();

  data.forEach((doc) => {
    doc.url = url;
    doc.orderId = orderId;
    doc.status = "placed";
    batch.set(db.collection("orders").doc(), doc);
  });

  // Commit the batch
  await batch.commit().then(function () {
    db.collection("cart")
      .doc(userId)
      .collection("items")
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });
  });
}
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors({ origin: "*" }));

app.get("/", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  res.send("cors problem fixed:)");
});

app.post("/payment", cors({ origin: "*" }), async (req, res) => {
  let { userId, address, phoneNumber, shippingName, id } = req.body;
  try {
    let data = [];
    // const file = pdf.create(pdfTemplate({ data: "hello" }), {});
    const orderId = uuidv1();
    const snapshot = await db
      .collection("cart")
      .doc(userId)
      .collection("items")
      .orderBy("time")
      .get();
    snapshot.forEach((doc) => {
      let d = doc.data();
      d.time = new Date();
      d.address = address;
      d.phoneNumber = phoneNumber;
      d.userId = userId;
      d.shippingName = shippingName;
      d.orderId = orderId;
      data.push(d);
      //   doc.ref.delete();
    });

    var q = 0;
    var amount = 0;

    for (let index = 0; index < data.length; index++) {
      q += data[index].quantity;
      amount += data[index].price * data[index].quantity;
    }

    const payment = await stripe.paymentIntents
      .create({
        amount: amount * 100,
        currency: "INR",
        description:
          "Order Details:" +
          data.map((e) => e.name + ", " + e.price).toString() +
          " Total:" +
          amount,
        payment_method: id,
        confirm: true,
      })
      .then(() => {
        const invoiceDetail = {
          items: data,
          shipping: { name: shippingName, address: address },
          orderId: orderId,
          subTotal: amount,
        };

        // console.log(invoiceDetail.shipping.name);

        pdf
          .create(pdfTemplate(invoiceDetail), {
            format: "A2",
            orientation: "portrait",
          })
          .toBuffer(function (err, buffer) {
            if (err) {
              return console.log("error");
            }
            const invoiceUrl = uploadToCloud(userId, orderId, data, buffer);
          });
      });

    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Sever is listening on 4000`);
});
