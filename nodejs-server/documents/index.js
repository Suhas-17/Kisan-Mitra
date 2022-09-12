module.exports = (invoiceDetail) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
        integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
        crossorigin="anonymous"
      />
      <title>Document</title>
      <style>
      body {
        margin-top: 20px;
        color: #2e323c;
        background: #f5f6fa;
        position: relative;
        height: 100%;
      }
      .invoice-container {
        padding: 1rem;
      }
      .invoice-container .invoice-header .invoice-logo {
        margin: 0.8rem 0 0 0;
        display: inline-block;
        font-size: 1.6rem;
        font-weight: 700;
        color: #2e323c;
      }
      .invoice-container .invoice-header .invoice-logo img {
        max-width: 130px;
      }
      .invoice-container .invoice-header address {
        font-size: 0.8rem;
        color: #9fa8b9;
        margin: 0;
      }
      .invoice-container .invoice-details {
        margin: 1rem 0 0 0;
        padding: 1rem;
        line-height: 180%;
        background: #f5f6fa;
      }
      .invoice-container .invoice-details .invoice-num {
        text-align: right;
        font-size: 0.8rem;
      }
      .invoice-container .invoice-body {
        padding: 1rem 0 0 0;
      }
      .invoice-container .invoice-footer {
        text-align: center;
        font-size: 0.7rem;
        margin: 5px 0 0 0;
      }

      .invoice-status {
        text-align: center;
        padding: 1rem;
        background: #ffffff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
      .invoice-status h2.status {
        margin: 0 0 0.8rem 0;
      }
      .invoice-status h5.status-title {
        margin: 0 0 0.8rem 0;
        color: #9fa8b9;
      }
      .invoice-status p.status-type {
        margin: 0.5rem 0 0 0;
        padding: 0;
        line-height: 150%;
      }
      .invoice-status i {
        font-size: 1.5rem;
        margin: 0 0 1rem 0;
        display: inline-block;
        padding: 1rem;
        background: #f5f6fa;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
      }
      .invoice-status .badge {
        text-transform: uppercase;
      }

      @media (max-width: 767px) {
        .invoice-container {
          padding: 1rem;
        }
      }

      .custom-table {
        border: 1px solid #e0e3ec;
      }
      .custom-table > thead th {
        border: 0;
        background: rgb(83, 187, 73) !important;
        color: #ffffff;
      }
      .custom-table > tbody tr:hover {
        background: #fafafa;
      }
      .custom-table > tbody tr:nth-of-type(even) {
        background-color: #ffffff;
      }
      .custom-table > tbody td {
        border: 1px solid #e6e9f0;
      }

      .card {
        background: #ffffff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        border: 0;
        margin-bottom: 1rem;
      }

      .text-center{
        text-align: center;
      }

      .text-right{
        text-align: right;
      }

      .text-success {
        color: rgb(83, 187, 73) !important;
      }

      .text-muted {
        color: #9fa8b9 !important;
      }

      .custom-actions-btns {
        margin: auto;
        display: flex;
        justify-content: flex-end;
      }

      .custom-actions-btns .btn {
        margin: 0.3rem 0 0.3rem 0.3rem;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="row gutters">
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="card">
              <div class="card-body p-0">
                <div class="invoice-container">
                  <div class="invoice-header">
                    <!-- Row start -->
                    <!-- <div class="row gutters">
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div class="custom-actions-btns mb-5">
                          <a href="#" class="btn btn-primary">
                            <i class="icon-download"></i> Download
                          </a>
                          <a href="#" class="btn btn-secondary">
                            <i class="icon-printer"></i> Print
                          </a>
                        </div>
                      </div>
                    </div> -->
                    <!-- Row end -->
                    <!-- Row start -->
                    <div class="row gutters">
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <p class="invoice-logo">Kisan Mitra</p>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6">
                        <address class="text-right">
                          #123, 2nd Cross<br />
                          Bangalore<br />
                          560056
                        </address>
                      </div>
                    </div>
                    <!-- Row end -->
                    <!-- Row start -->
                    <div class="row gutters">
                      <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div class="invoice-details">
                          <address id="client__address">
                           ${invoiceDetail.shipping.name}<br />
                            ${invoiceDetail.shipping.address}
                          </address>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div class="invoice-details">
                          <div class="invoice-num">
                            <div>Order ID: ${invoiceDetail.orderId}</div>
                            <div><p id="demo"></p></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Row end -->
                  </div>
                  <div class="invoice-body">
                    <!-- Row start -->
                    <div class="row gutters">
                      <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="table-responsive">
                          <table class="table custom-table m-0">
                            <thead>
                              <tr>
                                <th>Items</th>
                                <th class="text-center">Price</th>
                                <th class="text-center">Quantity</th>
                                <th class="text-center">Sub Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              

                            ${invoiceDetail.items.map(
                              (e) =>
                                `<tr>
                                <td>
                                  ${e.name}
                                  <p class="m-0 text-muted">
                                    Sold By: ${e['company/manufacture']}
                                  </p>
                                </td>
                                <td class="text-right">${parseFloat(e.price).toFixed(2)}</td>
                                <td class="text-center">${e.quantity}</td>
                                <td class="text-right">${parseFloat(e.price * e.quantity).toFixed(2)}</td>
                              </tr>`
                            )}

                              
                              <tr>
                                <td>&nbsp;</td>
                                <td colspan="2">
                                  <p>
                                    Subtotal<br />
                                    Shipping &amp; Handling<br />
                                    Tax<br />
                                  </p>
                                  <h5 class="text-success">
                                    <strong>Grand Total</strong>
                                  </h5>
                                </td>
                                <td class="text-right">
                                  <p>
                                    ₹${parseFloat(
                                      invoiceDetail.subTotal
                                    ).toFixed(2)}<br />
                                    ₹00.00<br />
                                    ₹00.00<br />
                                  </p>
                                  <h5 class="text-success">
                                    <strong>₹${parseFloat(
                                      invoiceDetail.subTotal
                                    ).toFixed(2)}</strong>
                                  </h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <!-- Row end -->
                  </div>
                  <!-- <div class="invoice-footer">Thank you for your Business.</div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script>
          const d = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          document.getElementById("demo").innerHTML = d;
          </script>
    </body>
  </html>`;
};
