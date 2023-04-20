const User = require('../model/auth.model');
const dotenv = require('dotenv');
dotenv.config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'spinwash',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net',
});

exports.readController = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    console.log('fetching user');
    res.json(user);
  });
};

exports.updateController = (req, res) => {
  const {
    name,
    _id,
    phoneNumber,
    profilePicture,
    address,
    preferences,
    shirtFoldingPreference,
    shirtWashingPreference,
    beddingPreference,
  } = req.body;
  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      console.log('this is the error ', err);
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.name = name;
    user.profilePicture = profilePicture;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.preferences = preferences;
    user.shirtFoldingPreference = shirtFoldingPreference;
    user.shirtWashingPreference = shirtWashingPreference;
    user.beddingPreference = beddingPreference;
    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      console.log('Updated user 🙂 - ', updatedUser);
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.updateOrders = (req, res) => {
  const { id } = req.params;
  const { pickupTime, pickup, dropOffTime, dropOff, address, requirements, promo } =
    req.body;
  // find by document id and update and push item in array
  console.log(pickupTime, pickup, dropOffTime, dropOff, address, requirements, promo);

  let email = '';
  let name = '';
  // find the user in db
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('fetching user for order update');
    email = user.email;
    console.log(email);
    name = user.name;

    console.log('email - ', email);

    //send mail to spinwash for order
    const emailData = {
      from: 'Spinwash <noreply@spinwash.co.uk>',
      to: 'spinwash8@gmail.com',
      subject: 'Order created',
      html: `
     
          <title>Order confirmation Transactional email</title>
         
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
            rel="stylesheet"
          />
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
            .ExternalClass {
              width: 100%;
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
            .es-button {
              mso-style-priority: 100 !important;
              text-decoration: none !important;
            }
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
            }
            .es-desk-hidden {
              display: none;
              float: left;
              overflow: hidden;
              width: 0;
              max-height: 0;
              line-height: 0;
              mso-hide: all;
            }
            [data-ogsb] .es-button {
              border-width: 0 !important;
              padding: 10px 20px 10px 20px !important;
            }
            @media only screen and (max-width: 600px) {
              p,
              ul li,
              ol li,
              a {
                line-height: 150% !important;
              }
              h1,
              h2,
              h3,
              h1 a,
              h2 a,
              h3 a {
                line-height: 150% !important;
              }
              h1 {
                font-size: 17px !important;
                text-align: center;
              }
              h2 {
                font-size: 15px !important;
                text-align: left;
              }
              h3 {
                font-size: 16px !important;
                text-align: center;
              }
              .es-header-body h1 a,
              .es-content-body h1 a,
              .es-footer-body h1 a {
                font-size: 17px !important;
              }
              .es-header-body h2 a,
              .es-content-body h2 a,
              .es-footer-body h2 a {
                font-size: 15px !important;
                text-align: left;
              }
              .es-header-body h3 a,
              .es-content-body h3 a,
              .es-footer-body h3 a {
                font-size: 16px !important;
              }
              .es-menu td a {
                font-size: 16px !important;
              }
              .es-header-body p,
              .es-header-body ul li,
              .es-header-body ol li,
              .es-header-body a {
                font-size: 16px !important;
              }
              .es-content-body p,
              .es-content-body ul li,
              .es-content-body ol li,
              .es-content-body a {
                font-size: 16px !important;
              }
              .es-footer-body p,
              .es-footer-body ul li,
              .es-footer-body ol li,
              .es-footer-body a {
                font-size: 15px !important;
              }
              .es-infoblock p,
              .es-infoblock ul li,
              .es-infoblock ol li,
              .es-infoblock a {
                font-size: 12px !important;
              }
              *[class='gmail-fix'] {
                display: none !important;
              }
              .es-m-txt-c,
              .es-m-txt-c h1,
              .es-m-txt-c h2,
              .es-m-txt-c h3 {
                text-align: center !important;
              }
              .es-m-txt-r,
              .es-m-txt-r h1,
              .es-m-txt-r h2,
              .es-m-txt-r h3 {
                text-align: right !important;
              }
              .es-m-txt-r img,
              .es-m-txt-c img,
              .es-m-txt-l img {
                display: inline !important;
              }
              .es-button-border {
                display: inline-block !important;
              }
              .es-btn-fw {
                border-width: 10px 0px !important;
                text-align: center !important;
              }
              .es-adaptive table,
              .es-btn-fw,
              .es-btn-fw-brdr,
              .es-left,
              .es-right {
                width: 100% !important;
              }
              .es-content table,
              .es-header table,
              .es-footer table,
              .es-content,
              .es-footer,
              .es-header {
                width: 100% !important;
                max-width: 600px !important;
              }
              .es-adapt-td {
                display: block !important;
                width: 100% !important;
              }
              .adapt-img {
                width: 100% !important;
                height: auto !important;
              }
              .es-m-p0 {
                padding: 0 !important;
              }
              .es-m-p0r {
                padding-right: 0 !important;
              }
              .es-m-p0l {
                padding-left: 0 !important;
              }
              .es-m-p0t {
                padding-top: 0 !important;
              }
              .es-m-p0b {
                padding-bottom: 0 !important;
              }
              .es-m-p20b {
                padding-bottom: 20px !important;
              }
              .es-mobile-hidden,
              .es-hidden {
                display: none !important;
              }
              tr.es-desk-hidden,
              td.es-desk-hidden,
              table.es-desk-hidden {
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important;
              }
              tr.es-desk-hidden {
                display: table-row !important;
              }
              table.es-desk-hidden {
                display: table !important;
              }
              td.es-desk-menu-hidden {
                display: table-cell !important;
              }
              .es-menu td {
                width: 1% !important;
              }
              table.es-table-not-adapt,
              .esd-block-html table {
                width: auto !important;
              }
              table.es-social {
                display: inline-block !important;
              }
              table.es-social td {
                display: inline-block !important;
              }
              a.es-button,
              button.es-button {
                font-size: 15px !important;
                display: inline-block !important;
              }
              .es-m-p5 {
                padding: 5px !important;
              }
              .es-m-p5t {
                padding-top: 5px !important;
              }
              .es-m-p5b {
                padding-bottom: 5px !important;
              }
              .es-m-p5r {
                padding-right: 5px !important;
              }
              .es-m-p5l {
                padding-left: 5px !important;
              }
              .es-m-p10 {
                padding: 10px !important;
              }
              .es-m-p10t {
                padding-top: 10px !important;
              }
              .es-m-p10b {
                padding-bottom: 10px !important;
              }
              .es-m-p10r {
                padding-right: 10px !important;
              }
              .es-m-p10l {
                padding-left: 10px !important;
              }
              .es-m-p15 {
                padding: 15px !important;
              }
              .es-m-p15t {
                padding-top: 15px !important;
              }
              .es-m-p15b {
                padding-bottom: 15px !important;
              }
              .es-m-p15r {
                padding-right: 15px !important;
              }
              .es-m-p15l {
                padding-left: 15px !important;
              }
              .es-m-p20 {
                padding: 20px !important;
              }
              .es-m-p20t {
                padding-top: 20px !important;
              }
              .es-m-p20r {
                padding-right: 20px !important;
              }
              .es-m-p20l {
                padding-left: 20px !important;
              }
              .es-m-p25 {
                padding: 25px !important;
              }
              .es-m-p25t {
                padding-top: 25px !important;
              }
              .es-m-p25b {
                padding-bottom: 25px !important;
              }
              .es-m-p25r {
                padding-right: 25px !important;
              }
              .es-m-p25l {
                padding-left: 25px !important;
              }
              .es-m-p30 {
                padding: 30px !important;
              }
              .es-m-p30t {
                padding-top: 30px !important;
              }
              .es-m-p30b {
                padding-bottom: 30px !important;
              }
              .es-m-p30r {
                padding-right: 30px !important;
              }
              .es-m-p30l {
                padding-left: 30px !important;
              }
              .es-m-p35 {
                padding: 35px !important;
              }
              .es-m-p35t {
                padding-top: 35px !important;
              }
              .es-m-p35b {
                padding-bottom: 35px !important;
              }
              .es-m-p35r {
                padding-right: 35px !important;
              }
              .es-m-p35l {
                padding-left: 35px !important;
              }
              .es-m-p40 {
                padding: 40px !important;
              }
              .es-m-p40t {
                padding-top: 40px !important;
              }
              .es-m-p40b {
                padding-bottom: 40px !important;
              }
              .es-m-p40r {
                padding-right: 40px !important;
              }
              .es-m-p40l {
                padding-left: 40px !important;
              }
            }
          </style>
        </head>
        <body
          data-new-gr-c-s-loaded="14.1057.0"
          style="
            width: 100%;
            font-family: 'DM Serif Display', serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            padding: 0;
            margin: 0;
          "
        >
          <div class="es-wrapper-color" style="background-color: #f5f5f5">
            <table
              class="es-wrapper"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                background-repeat: repeat;
                background-position: center top;
              "
            >
              <tr style="border-collapse: collapse">
                <td valign="top" style="padding: 0; margin: 0">
                  <table
                    class="es-footer"
                    cellspacing="0"
                    cellpadding="0"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      table-layout: fixed !important;
                      width: 100%;
                      background-color: transparent;
                      background-repeat: repeat;
                      background-position: center top;
                    "
                  >
                    <tr style="border-collapse: collapse">
                      <td align="center" style="padding: 0; margin: 0">
                        <table
                          class="es-footer-body"
                          cellspacing="0"
                          cellpadding="0"
                          bgcolor="#ffffff"
                          align="center"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            background-color: #ffffff;
                            width: 600px;
                          "
                        >
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              align="left"
                              bgcolor="#f6f6f6"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 5px;
                                padding-right: 5px;
                                padding-left: 20px;
                                background-color: #f6f6f6;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 575px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 20px;
                                            padding-bottom: 20px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 0px solid #cccccc;
                                                  background: none;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                         
                          <tr
                            class="es-desk-hidden"
                            style="
                              display: none;
                              float: left;
                              overflow: hidden;
                              width: 0;
                              max-height: 0;
                              line-height: 0;
                              mso-hide: all;
                              border-collapse: collapse;
                            "
                          >
                            <td
                              class="es-m-p0t"
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-left: 15px;
                                            font-size: 0px;
                                          "
                                        >
                                          <a
                                            href="#"
                                            style="
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              text-decoration: underline;
                                              color: #ffffff;
                                              font-size: 14px;
                                            "
                                            ><img
                                              src="https://eyajum.stripocdn.email/content/guids/CABINET_2fa0b0a8ac8b3216a7b1db5a452505d4/images/32073_spinwash_twitter_profile_copy.jpeg"
                                              alt
                                              style="
                                                display: block;
                                                border: 0;
                                                outline: none;
                                                text-decoration: none;
                                                -ms-interpolation-mode: bicubic;
                                              "
                                              width="120"
                                          /></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!--<![endif]-->
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              class="esdev-adapt-off"
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                class="esdev-mso-table"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                  width: 560px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    class="esdev-mso-td"
                                    valign="top"
                                    style="padding: 0; margin: 0"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="es-left"
                                      align="left"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                        float: left;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0; width: 270px"
                                        >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                align="left"
                                                class="es-m-txt-c"
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  padding-left: 15px;
                                                  font-size: 0px;
                                                "
                                              >
                                                <a
                                                  href="#"
                                                  style="
                                                    -webkit-text-size-adjust: none;
                                                    -ms-text-size-adjust: none;
                                                    mso-line-height-rule: exactly;
                                                    text-decoration: underline;
                                                    color: #ffffff;
                                                    font-size: 14px;
                                                  "
                                                  ><img
                                                    src="https://eyajum.stripocdn.email/content/guids/CABINET_2fa0b0a8ac8b3216a7b1db5a452505d4/images/32073_spinwash_twitter_profile_copy.jpeg"
                                                    alt
                                                    style="
                                                      display: block;
                                                      border: 0;
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                    "
                                                    width="120"
                                                /></a>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td style="padding: 0; margin: 0; width: 20px"></td>
                                  <td
                                    class="esdev-mso-td"
                                    valign="top"
                                    style="padding: 0; margin: 0"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="es-right"
                                      align="right"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                        float: right;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0; width: 270px"
                                        >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                align="right"
                                                class="es-m-txt-c es-m-p10t es-m-p10r"
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  padding-left: 10px;
                                                  padding-right: 30px;
                                                  padding-top: 40px;
                                                "
                                              >
                                                <p
                                                  style="
                                                    margin: 0;
                                                    -webkit-text-size-adjust: none;
                                                    -ms-text-size-adjust: none;
                                                    mso-line-height-rule: exactly;
                                                    font-family: 'DM Serif Display',
                                                      serif;
                                                    line-height: 32px;
                                                    color: #17476c;
                                                    font-size: 16px;
                                                  "
                                                >
                                                  <font
                                                    face="lato, helvetica neue, helvetica, arial, sans-serif"
                                                    style="font-size: 17px"
                                                    ><b>S P I N W A S H</b></font
                                                  >
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 10px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          class="es-m-p10t es-m-p20b es-m-p5r es-m-p5l es-m-txt-l"
                                          style="
                                            margin: 0;
                                            padding-top: 30px;
                                            padding-left: 30px;
                                            padding-right: 30px;
                                            padding-bottom: 35px;
                                          "
                                        >
                                          <h1
                                            style="
                                              margin: 0;
                                              line-height: 27px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 18px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #1b4d79;
                                              text-align: left;
                                            "
                                          >
                                            New Order<br /><br />
                                            You Received a New order from ${name}
                                          </h1>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              class="es-m-p10t es-m-p15b es-m-p10r"
                              align="left"
                              style="
                                margin: 0;
                                padding-top: 5px;
                                padding-left: 20px;
                                padding-right: 20px;
                                padding-bottom: 25px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: separate;
                                        border-spacing: 0px;
                                        border-left: 1px dashed #333333;
                                        border-right: 1px dashed #333333;
                                        border-top: 1px dashed #333333;
                                        border-bottom: 1px dashed #333333;
                                        border-radius: 7px;
                                        background-color: #def1fe;
                                      "
                                      bgcolor="#def1fe"
                                      role="presentation"
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p25t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-top: 20px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 36px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 24px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #3c3b3b;
                                              text-align: center;
                                            "
                                          >
                                            <strong style="font-size: 17px"
                                              ><font
                                                face="lato, helvetica neue, helvetica, arial, sans-serif"
                                                >NAME</font
                                              ></strong
                                            >
                                          </h2>
                                          <p
                                            style="
                                              margin: 0;
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              font-family: 'DM Serif Display', serif;
                                              line-height: 21px;
                                              color: #3c3b3b;
                                              font-size: 14px;
                                            "
                                          >
                                            <font
                                              face="arial, helvetica neue, helvetica, sans-serif"
                                              style="font-size: 17px"
                                              >${name}</font
                                            >
                                          </p>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>EMAIL</strong>
                                          </h2>
                                          <font
                                            color="#2f4f4f"
                                            face="arial, helvetica neue, helvetica, sans-serif"
                                            style="font-size: 17px"
                                            >${email}</font
                                          >
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>ADDRESS</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${address}
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>PICK UP DATE &amp; TIME</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${pickup} - ${pickupTime}
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 30px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>DROP OFF DATE &amp; TIME</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${dropOff} - ${dropOffTime}
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 30px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>Requirements</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                          <br />  
                                          ${requirements}
                                          <strong>Promo Code</strong>
                                          ${promo} 
                                         
                                          </h3>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-bottom: 10px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              ></table>
                            </td>
                          </tr>
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              align="left"
                              bgcolor="#f6f6f6"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 5px;
                                padding-right: 5px;
                                padding-left: 20px;
                                background-color: #f6f6f6;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 575px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 15px;
                                            padding-bottom: 15px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 0px solid #cccccc;
                                                  background: none;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
      
          `,
    };
    const emailDataClient = {
      from: 'Spinwash <noreply@spinwash.co.uk>',
      to: email,
      subject: 'Order Confirmed',
      html: `
      
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
            rel="stylesheet"
          />
          
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
            .ExternalClass {
              width: 100%;
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
            .es-button {
              mso-style-priority: 100 !important;
              text-decoration: none !important;
            }
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
            }
            .es-desk-hidden {
              display: none;
              float: left;
              overflow: hidden;
              width: 0;
              max-height: 0;
              line-height: 0;
              mso-hide: all;
            }
            [data-ogsb] .es-button {
              border-width: 0 !important;
              padding: 10px 20px 10px 20px !important;
            }
            @media only screen and (max-width: 600px) {
              p,
              ul li,
              ol li,
              a {
                line-height: 150% !important;
              }
              h1,
              h2,
              h3,
              h1 a,
              h2 a,
              h3 a {
                line-height: 150% !important;
              }
              h1 {
                font-size: 17px !important;
                text-align: center;
              }
              h2 {
                font-size: 15px !important;
                text-align: left;
              }
              h3 {
                font-size: 16px !important;
                text-align: center;
              }
              .es-header-body h1 a,
              .es-content-body h1 a,
              .es-footer-body h1 a {
                font-size: 17px !important;
              }
              .es-header-body h2 a,
              .es-content-body h2 a,
              .es-footer-body h2 a {
                font-size: 15px !important;
                text-align: left;
              }
              .es-header-body h3 a,
              .es-content-body h3 a,
              .es-footer-body h3 a {
                font-size: 16px !important;
              }
              .es-menu td a {
                font-size: 16px !important;
              }
              .es-header-body p,
              .es-header-body ul li,
              .es-header-body ol li,
              .es-header-body a {
                font-size: 16px !important;
              }
              .es-content-body p,
              .es-content-body ul li,
              .es-content-body ol li,
              .es-content-body a {
                font-size: 16px !important;
              }
              .es-footer-body p,
              .es-footer-body ul li,
              .es-footer-body ol li,
              .es-footer-body a {
                font-size: 15px !important;
              }
              .es-infoblock p,
              .es-infoblock ul li,
              .es-infoblock ol li,
              .es-infoblock a {
                font-size: 12px !important;
              }
              *[class='gmail-fix'] {
                display: none !important;
              }
              .es-m-txt-c,
              .es-m-txt-c h1,
              .es-m-txt-c h2,
              .es-m-txt-c h3 {
                text-align: center !important;
              }
              .es-m-txt-r,
              .es-m-txt-r h1,
              .es-m-txt-r h2,
              .es-m-txt-r h3 {
                text-align: right !important;
              }
              .es-m-txt-r img,
              .es-m-txt-c img,
              .es-m-txt-l img {
                display: inline !important;
              }
              .es-button-border {
                display: inline-block !important;
              }
              .es-btn-fw {
                border-width: 10px 0px !important;
                text-align: center !important;
              }
              .es-adaptive table,
              .es-btn-fw,
              .es-btn-fw-brdr,
              .es-left,
              .es-right {
                width: 100% !important;
              }
              .es-content table,
              .es-header table,
              .es-footer table,
              .es-content,
              .es-footer,
              .es-header {
                width: 100% !important;
                max-width: 600px !important;
              }
              .es-adapt-td {
                display: block !important;
                width: 100% !important;
              }
              .adapt-img {
                width: 100% !important;
                height: auto !important;
              }
              .es-m-p0 {
                padding: 0 !important;
              }
              .es-m-p0r {
                padding-right: 0 !important;
              }
              .es-m-p0l {
                padding-left: 0 !important;
              }
              .es-m-p0t {
                padding-top: 0 !important;
              }
              .es-m-p0b {
                padding-bottom: 0 !important;
              }
              .es-m-p20b {
                padding-bottom: 20px !important;
              }
              .es-mobile-hidden,
              .es-hidden {
                display: none !important;
              }
              tr.es-desk-hidden,
              td.es-desk-hidden,
              table.es-desk-hidden {
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important;
              }
              tr.es-desk-hidden {
                display: table-row !important;
              }
              table.es-desk-hidden {
                display: table !important;
              }
              td.es-desk-menu-hidden {
                display: table-cell !important;
              }
              .es-menu td {
                width: 1% !important;
              }
              table.es-table-not-adapt,
              .esd-block-html table {
                width: auto !important;
              }
              table.es-social {
                display: inline-block !important;
              }
              table.es-social td {
                display: inline-block !important;
              }
              a.es-button,
              button.es-button {
                font-size: 15px !important;
                display: inline-block !important;
              }
              .es-m-p5 {
                padding: 5px !important;
              }
              .es-m-p5t {
                padding-top: 5px !important;
              }
              .es-m-p5b {
                padding-bottom: 5px !important;
              }
              .es-m-p5r {
                padding-right: 5px !important;
              }
              .es-m-p5l {
                padding-left: 5px !important;
              }
              .es-m-p10 {
                padding: 10px !important;
              }
              .es-m-p10t {
                padding-top: 10px !important;
              }
              .es-m-p10b {
                padding-bottom: 10px !important;
              }
              .es-m-p10r {
                padding-right: 10px !important;
              }
              .es-m-p10l {
                padding-left: 10px !important;
              }
              .es-m-p15 {
                padding: 15px !important;
              }
              .es-m-p15t {
                padding-top: 15px !important;
              }
              .es-m-p15b {
                padding-bottom: 15px !important;
              }
              .es-m-p15r {
                padding-right: 15px !important;
              }
              .es-m-p15l {
                padding-left: 15px !important;
              }
              .es-m-p20 {
                padding: 20px !important;
              }
              .es-m-p20t {
                padding-top: 20px !important;
              }
              .es-m-p20r {
                padding-right: 20px !important;
              }
              .es-m-p20l {
                padding-left: 20px !important;
              }
              .es-m-p25 {
                padding: 25px !important;
              }
              .es-m-p25t {
                padding-top: 25px !important;
              }
              .es-m-p25b {
                padding-bottom: 25px !important;
              }
              .es-m-p25r {
                padding-right: 25px !important;
              }
              .es-m-p25l {
                padding-left: 25px !important;
              }
              .es-m-p30 {
                padding: 30px !important;
              }
              .es-m-p30t {
                padding-top: 30px !important;
              }
              .es-m-p30b {
                padding-bottom: 30px !important;
              }
              .es-m-p30r {
                padding-right: 30px !important;
              }
              .es-m-p30l {
                padding-left: 30px !important;
              }
              .es-m-p35 {
                padding: 35px !important;
              }
              .es-m-p35t {
                padding-top: 35px !important;
              }
              .es-m-p35b {
                padding-bottom: 35px !important;
              }
              .es-m-p35r {
                padding-right: 35px !important;
              }
              .es-m-p35l {
                padding-left: 35px !important;
              }
              .es-m-p40 {
                padding: 40px !important;
              }
              .es-m-p40t {
                padding-top: 40px !important;
              }
              .es-m-p40b {
                padding-bottom: 40px !important;
              }
              .es-m-p40r {
                padding-right: 40px !important;
              }
              .es-m-p40l {
                padding-left: 40px !important;
              }
            }
          </style>
        </head>
        <body
          data-new-gr-c-s-loaded="14.1057.0"
          style="
            width: 100%;
            font-family: 'DM Serif Display', serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            padding: 0;
            margin: 0;
          "
        >
          <div class="es-wrapper-color" style="background-color: #f5f5f5">
         
            <table
              class="es-wrapper"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                background-repeat: repeat;
                background-position: center top;
              "
            >
              <tr style="border-collapse: collapse">
                <td valign="top" style="padding: 0; margin: 0">
                  <table
                    class="es-footer"
                    cellspacing="0"
                    cellpadding="0"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      table-layout: fixed !important;
                      width: 100%;
                      background-color: transparent;
                      background-repeat: repeat;
                      background-position: center top;
                    "
                  >
                    <tr style="border-collapse: collapse">
                      <td align="center" style="padding: 0; margin: 0">
                        <table
                          class="es-footer-body"
                          cellspacing="0"
                          cellpadding="0"
                          bgcolor="#ffffff"
                          align="center"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            background-color: #ffffff;
                            width: 600px;
                          "
                        >
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              align="left"
                              bgcolor="#f6f6f6"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 5px;
                                padding-right: 5px;
                                padding-left: 20px;
                                background-color: #f6f6f6;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 575px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 20px;
                                            padding-bottom: 20px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 0px solid #cccccc;
                                                  background: none;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr
                            class="es-desk-hidden"
                            style="
                              display: none;
                              float: left;
                              overflow: hidden;
                              width: 0;
                              max-height: 0;
                              line-height: 0;
                              mso-hide: all;
                              border-collapse: collapse;
                            "
                          >
                            <td
                              class="es-m-p0t"
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-left: 15px;
                                            font-size: 0px;
                                          "
                                        >
                                          <a
                                            href="#"
                                            style="
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              text-decoration: underline;
                                              color: #ffffff;
                                              font-size: 14px;
                                            "
                                            ><img
                                              src="https://eyajum.stripocdn.email/content/guids/CABINET_2fa0b0a8ac8b3216a7b1db5a452505d4/images/32073_spinwash_twitter_profile_copy.jpeg"
                                              alt
                                              style="
                                                display: block;
                                                border: 0;
                                                outline: none;
                                                text-decoration: none;
                                                -ms-interpolation-mode: bicubic;
                                              "
                                              width="120"
                                          /></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!--<![endif]-->
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              class="esdev-adapt-off"
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                class="esdev-mso-table"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                  width: 560px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    class="esdev-mso-td"
                                    valign="top"
                                    style="padding: 0; margin: 0"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="es-left"
                                      align="left"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                        float: left;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0; width: 270px"
                                        >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                align="left"
                                                class="es-m-txt-c"
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  padding-left: 15px;
                                                  font-size: 0px;
                                                "
                                              >
                                                <a
                                                  href="#"
                                                  style="
                                                    -webkit-text-size-adjust: none;
                                                    -ms-text-size-adjust: none;
                                                    mso-line-height-rule: exactly;
                                                    text-decoration: underline;
                                                    color: #ffffff;
                                                    font-size: 14px;
                                                  "
                                                  ><img
                                                    src="https://eyajum.stripocdn.email/content/guids/CABINET_2fa0b0a8ac8b3216a7b1db5a452505d4/images/32073_spinwash_twitter_profile_copy.jpeg"
                                                    alt
                                                    style="
                                                      display: block;
                                                      border: 0;
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                    "
                                                    width="120"
                                                /></a>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td style="padding: 0; margin: 0; width: 20px"></td>
                                  <td
                                    class="esdev-mso-td"
                                    valign="top"
                                    style="padding: 0; margin: 0"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="es-right"
                                      align="right"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                        float: right;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0; width: 270px"
                                        >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                align="right"
                                                class="es-m-txt-c es-m-p10t es-m-p10r"
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  padding-left: 10px;
                                                  padding-right: 30px;
                                                  padding-top: 40px;
                                                "
                                              >
                                                <p
                                                  style="
                                                    margin: 0;
                                                    -webkit-text-size-adjust: none;
                                                    -ms-text-size-adjust: none;
                                                    mso-line-height-rule: exactly;
                                                    font-family: 'DM Serif Display',
                                                      serif;
                                                    line-height: 32px;
                                                    color: #17476c;
                                                    font-size: 16px;
                                                  "
                                                >
                                                  <font
                                                    face="lato, helvetica neue, helvetica, arial, sans-serif"
                                                    style="font-size: 17px"
                                                    ><b>S P I N W A S H</b></font
                                                  >
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 10px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="left"
                                          class="es-m-p10t es-m-p20b es-m-p5r es-m-p5l es-m-txt-l"
                                          style="
                                            margin: 0;
                                            padding-top: 30px;
                                            padding-left: 30px;
                                            padding-right: 30px;
                                            padding-bottom: 35px;
                                          "
                                        >
                                          <h1
                                            style="
                                              margin: 0;
                                              line-height: 27px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 18px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #1b4d79;
                                              text-align: left;
                                            "
                                          >
                                            Hi ${name},<br /><br />Thank you for using
                                            Spinwash.<br />Here is your order
                                            confirmation details.
                                          </h1>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              class="es-m-p10t es-m-p15b es-m-p10r"
                              align="left"
                              style="
                                margin: 0;
                                padding-top: 5px;
                                padding-left: 20px;
                                padding-right: 20px;
                                padding-bottom: 25px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: separate;
                                        border-spacing: 0px;
                                        border-left: 1px dashed #333333;
                                        border-right: 1px dashed #333333;
                                        border-top: 1px dashed #333333;
                                        border-bottom: 1px dashed #333333;
                                        border-radius: 7px;
                                        background-color: #def1fe;
                                      "
                                      bgcolor="#def1fe"
                                      role="presentation"
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p25t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-top: 20px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 36px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 24px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #3c3b3b;
                                              text-align: center;
                                            "
                                          >
                                            <strong style="font-size: 17px"
                                              ><font
                                                face="lato, helvetica neue, helvetica, arial, sans-serif"
                                                >NAME</font
                                              ></strong
                                            >
                                          </h2>
                                          <p
                                            style="
                                              margin: 0;
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              font-family: 'DM Serif Display', serif;
                                              line-height: 21px;
                                              color: #3c3b3b;
                                              font-size: 14px;
                                            "
                                          >
                                            <font
                                              face="arial, helvetica neue, helvetica, sans-serif"
                                              style="font-size: 17px"
                                              >${name}</font
                                            >
                                          </p>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>EMAIL</strong>
                                          </h2>
                                          <font
                                            color="#2f4f4f"
                                            face="arial, helvetica neue, helvetica, sans-serif"
                                            style="font-size: 17px"
                                            >${email}</font
                                          >
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>ADDRESS</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${address}
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>PICK UP DATE &amp; TIME</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${pickup} - ${pickupTime}
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 1px solid #cccccc;
                                                  background: unset;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10t es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 5px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 30px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            <strong>DROP OFF DATE &amp; TIME</strong>
                                          </h2>
                                          <h3
                                            style="
                                              margin: 0;
                                              line-height: 26px;
                                              mso-line-height-rule: exactly;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-size: 17px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #2f4f4f;
                                              text-align: center;
                                            "
                                          >
                                            ${dropOff} - ${dropOffTime}
                                            <br />
                                            <br />

                                          <strong>Promo Code</strong>
                                            ${promo}
                                          </h3>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-bottom: 10px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          class="es-m-txt-c es-m-p10r es-m-p10l"
                                          style="
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                            padding-bottom: 30px;
                                          "
                                        >
                                          <h2
                                            style="
                                              margin: 0;
                                              line-height: 27px;
                                              mso-line-height-rule: exactly;
                                              font-family: lato, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              font-size: 18px;
                                              font-style: normal;
                                              font-weight: normal;
                                              color: #000000;
                                              text-align: center;
                                            "
                                          >
                                            Once we collect your items, we will
                                            provide you with an invoice and have them
                                            ready for you at your desired drop off
                                            time
                                          </h2>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr
                            class="es-mobile-hidden"
                            style="border-collapse: collapse"
                          >
                            <td
                              align="left"
                              bgcolor="#f6f6f6"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 5px;
                                padding-right: 5px;
                                padding-left: 20px;
                                background-color: #f6f6f6;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr style="border-collapse: collapse">
                                  <td
                                    align="center"
                                    valign="top"
                                    style="padding: 0; margin: 0; width: 575px"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr style="border-collapse: collapse">
                                        <td
                                          align="center"
                                          style="
                                            margin: 0;
                                            padding-top: 15px;
                                            padding-bottom: 15px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            font-size: 0;
                                          "
                                        >
                                          <table
                                            border="0"
                                            width="100%"
                                            height="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-collapse: collapse;
                                              border-spacing: 0px;
                                            "
                                          >
                                            <tr style="border-collapse: collapse">
                                              <td
                                                style="
                                                  padding: 0;
                                                  margin: 0;
                                                  border-bottom: 0px solid #cccccc;
                                                  background: none;
                                                  height: 1px;
                                                  width: 100%;
                                                  margin: 0px;
                                                "
                                              ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
      
          `,
    };

    User.findByIdAndUpdate(
      id,
      { $push: { order: req.body } },
      { safe: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json({ error: err });
        } else {
          console.log('new order created successfully');
          client.messages
            .create(process.env.MAIL_FROM, emailData)
            .then((sent) => {
              console.log('message sent successfully to spinwash', sent);
            })
            .catch((err) => {
              console.log('message not sent to spinwash', err);
            });

          client.messages
            .create(process.env.MAIL_FROM, emailDataClient)
            .then((sent) => {
              console.log('message sent successfully - ', sent);
              return res.json(doc.order);
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({
                success: false,
              });
            });
        }
      }
    );
  });
};

exports.getUserOrders = (req, res) => {
  const { _id } = req.params;

  User.findById(_id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('fetching user orders');
    res.json(user.order);
  });
};

exports.contactController = (req, res) => {
  const { name, email, message } = req.body;
  const emailData = {
    from: email,
    to: 'spinwash8@gmail.com',
    subject: 'New Message',
    html: `
              <h1>New Order</h1>
              <p>
              Email - ${email},
              <br/>
              Name - ${name},
              <br/>
              Message - ${message}
              <br/>
              </p>
              <hr />
          `,
  };
  client.messages
    .create(process.env.MAIL_FROM, emailData)
    .then((sent) => {
      return res.json({
        message: `Message sent successfully`,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        errors: 'Message not sent',
      });
    });
};
