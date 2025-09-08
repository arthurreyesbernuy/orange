<?php
// Identificador de su tienda
define("SHOP_ID", "48576921");

// Clave de Test o Producción
define("KEY", "Fu3cMxlzTmeE7Pxa");

// function dataForm(){
//   // $newParams = array(
//   //   "vads_action_mode" => "INTERACTIVE",
//   //   "vads_amount" => $_POST["amount"] * 100,
//   //   "vads_ctx_mode" => "TEST", // TEST O PRODUCTION
//   //   "vads_currency" => $_POST["currency"] == "PEN" ? 604:840, // Codigo ISO 4217
//   //   "vads_cust_address" => $_POST["address"],
//   //   "vads_cust_city" => $_POST["city"],
//   //   "vads_cust_country" => $_POST["country"],
//   //   "vads_cust_email" => $_POST["email"],
//   //   "vads_cust_first_name" => $_POST["firstName"],
//   //   "vads_cust_last_name" => $_POST["lastName"],
//   //   "vads_cust_national_id" => $_POST["identityCode"],
//   //   "vads_cust_phone" => $_POST["phoneNumber"],
//   //   "vads_cust_state" => $_POST["state"],
//   //   "vads_cust_zip" => $_POST["zipCode"],
//   //   "vads_order_id" => $_POST["orderId"],
//   //   "vads_page_action" => "PAYMENT",
//   //   "vads_payment_config" => "SINGLE",
//   //   "vads_redirect_success_timeout" => 5,
//   //   "vads_return_mode" => "POST",
//   //   "vads_site_id" => SHOP_ID,
//   //   "vads_trans_date" => date("YmdHis"), //Fecha en formato UTC
//   //   "vads_trans_id" =>  substr(md5(time()), -6),
//   //   "vads_url_return" => 'http://localhost/Redirect-PaymentForm-Php-main/result.php', //URL de retorno
//   //   "vads_version" => "V2"
//   // );
//   $utc_time = new DateTime('now', new DateTimeZone('UTC'));

//   // Formatea la fecha y hora al formato YYYYMMDDHHMMSS que la plataforma espera
//   $vads_trans_date = $utc_time->format('YmdHis');

//   $newParams = array(
//     "vads_action_mode" => "INTERACTIVE",
//     "vads_amount" => 15*100,
//     "vads_ctx_mode" => "TEST", // TEST O PRODUCTION
//     "vads_currency" => 604, // Codigo ISO 4217
//     "vads_cust_address" => "av bolivia 848",
//     "vads_cust_city" => "Lima",
//     "vads_cust_country" => "PE",
//     "vads_cust_email" => "alex23121987@gmail.com",
//     "vads_cust_first_name" => "Arthur",
//     "vads_cust_last_name" => "Reyes",
//     "vads_cust_national_id" => "44773858",
//     "vads_cust_phone" => "956819217",
//     "vads_cust_state" => "Lima",
//     "vads_cust_zip" => "",
//     "vads_order_id" => "ORD1234",
//     "vads_page_action" => "PAYMENT",
//     "vads_payment_config" => "SINGLE",
//     "vads_redirect_success_timeout" => 5,
//     "vads_return_mode" => "POST",
//     "vads_site_id" => SHOP_ID,
//     "vads_trans_date" => $vads_trans_date, //Fecha en formato UTC
//     "vads_trans_id" =>  substr(md5(time()), -6),
//     "vads_url_return" => 'https://orangefood.com.pe/result.php', //URL de retorno
//     "vads_version" => "V2"
//   );
//   $newParams["signature"] = calculateSignature($newParams, KEY);

//   return $newParams; 
// }

function calculateSignature($parameters, $key)
{
  $content_signature = "";
  // Ordenar los campos alfabéticamente
  ksort($parameters);
  foreach ($parameters as $name => $value) {
    if (substr($name, 0, 5) == 'vads_') {
      $content_signature .=  $value . "+";
    }
  }
  // Añadir la clave al final del string
  $content_signature .= $key;
  // Codificación base64 del string cifrada con el algoritmo HMAC-SHA-256
  $signature = base64_encode(hash_hmac('sha256', mb_convert_encoding($content_signature, "UTF-8"), $key, true));
  return $signature;
}

function checkSignature($parameters){
  $signature = $parameters['signature'];

  return $signature == calculateSignature($parameters, KEY);
}