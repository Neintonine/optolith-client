<?php
//funzt
$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
if (!$verbindung) {
    die();
    // die('Connect Error: ' . mysqli_connect_errno());
    exit;
}
$gid = $_GET['gid'];
$check = $_GET['c'];
$thing = $_GET['t'];
if ($check == 'p') {
    $thing = md5($thing);
    $sql1 = "UPDATE Char_Group SET Passwort = '$thing' WHERE GID = '$gid'";
    mysqli_query($verbindung, $sql1);
    if (mysqli_affected_rows($verbindung) > 0)
        echo "true";
    else
        echo "false";
}
elseif ($check == 'n') {
    $thing = mysqli_real_escape_string($verbindung, $thing);
    $sql2 = "UPDATE Char_Group SET Name = '$thing' WHERE GID = '$gid'";
    mysqli_query($verbindung, $sql2);
    if (mysqli_affected_rows($verbindung) > 0)
        echo "true";
    else
        echo "false";
}
else
    echo "false";

?>