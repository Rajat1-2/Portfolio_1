<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json');

if (isset($_POST['submitbtn'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];


    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);

    try {
        //Server settings
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->SMTPAuth = true;                                   //Enable SMTP authentication

        $mail->Host = 'smtp.gmail.com';                     //Set the SMTP server to send through
        $mail->Username = 'rajatparashar456@gmail.com';                     //SMTP username
        $mail->Password = 'mnyj hdjh qeid miez ';                               //SMTP password

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //ENCRYPTION_SMTPS 465 - Enable implicit TLS encryption
        $mail->Port = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('rajatparashar456@gmail.com', 'Raj Shar');
        $mail->addAddress('rajatparashar456@gmail.com', 'Raj Shar');     //Add a recipient

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'New enquiry - Rajat';

        $bodyContent = '<div>Hello, you got a new enquiry</div>
            <div>Fullname: ' . $name . '</div>
            <div>Email: ' . $email . '</div>
            <div>Subject: ' . $subject . '</div>
            <div>Message: ' . $message . '</div>
        ';

        $mail->Body = $bodyContent;

        if ($mail->send()) {
            $_SESSION['status'] = "Thank you contact us - KetShar";
            //header("Location: {$_SERVER["HTTP_REFERER"]}");
            $response = ['status' => 'success'];
            echo json_encode($response);
            //echo '<script>alert("Message sent successfully. We will get back to you soon."); window.location = "../../index.html";</script>';
            exit(0);
        } else {
            $_SESSION['status'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            //echo '<script>alert("Message not sent"); window.location = "../../index.html";</script>';
            $response = ['status' => 'error'];
            echo json_encode($response);
            //header("Location: {$_SERVER["HTTP_REFERER"]}");
            exit(0);
        }

    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        $response = ['status' => 'error'];
    }
    echo json_encode($response);
} else {
    header('Location: ../../index.html');
    exit(0);
}
